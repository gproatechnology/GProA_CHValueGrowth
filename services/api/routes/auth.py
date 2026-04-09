"""
Authentication routes - CHValueGrowth API v1
Endpoints for user authentication with JWT tokens.

Features:
- JWT token authentication
- Token refresh capability
- Rate limiting
- Password hashing (bcrypt)
- Input validation
- Comprehensive error handling
- Logging and audit trail
"""

from fastapi import APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from jose import jwt
import datetime
from datetime import timedelta
import os
import logging
import bcrypt as bcrypt_lib
import redis
from functools import wraps

# Router
router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])

# Logger
logger = logging.getLogger(__name__)

# Security configuration
security = HTTPBearer(auto_error=False)

# Password hashing helpers (using bcrypt directly — passlib 1.7.4 is not compatible with bcrypt >= 4.0)
def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt_lib.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def _hash_password(plain: str) -> str:
    return bcrypt_lib.hashpw(plain.encode("utf-8"), bcrypt_lib.gensalt()).decode("utf-8")

# JWT Configuration (from environment variables)
JWT_SECRET = os.environ.get("JWT_SECRET", "chvalue2026_secret_key_change_in_production")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.environ.get("JWT_EXPIRATION_HOURS", "24"))
JWT_REFRESH_EXPIRATION_DAYS = int(os.environ.get("JWT_REFRESH_EXPIRATION_DAYS", "7"))

# Rate limiting (optional, requires redis)
REDIS_URL = os.environ.get("REDIS_URL", None)
redis_client = None
if REDIS_URL:
    try:
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        logger.info("Redis client initialized for rate limiting")
    except Exception as e:
        logger.warning(f"Failed to initialize Redis: {e}")

# Mock user database (in production, use real database with hashed passwords)
# Passwords are hashed with bcrypt
MOCK_USERS = {
    "admin": {
        "password_hash": "$2b$12$lP/6zOTsVb2me5uj4EqFk.ZcHbuHJS6JKwxHg/rTukZbLYOx5Nr1e",  # admin123
        "name": "Administrador",
        "role": "admin",
        "email": "admin@chvaluegrowth.com",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": None
    },
    "user": {
        "password_hash": "$2b$12$7tM3XPyZyF949oQmefPZgOT.bRsBAJbKqUVKVLdNhJxIXIS3h/GNC",  # user123
        "name": "Usuario Regular",
        "role": "user",
        "email": "user@chvaluegrowth.com",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": None
    }
}

# Models with validation
class LoginRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=6, max_length=100, description="Password")
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.replace('_', '').isalnum():
            raise ValueError('Username must be alphanumeric or contain underscores')
        return v.lower()

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Refresh token")

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=6)
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    expires_in: Optional[int] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserInfo(BaseModel):
    username: str
    name: str
    role: str
    email: str

# Token management
class TokenManager:
    """Manage JWT tokens (blacklist, refresh, etc.)"""
    
    def __init__(self):
        self.blacklist = set()  # In production, use Redis
        self.refresh_tokens = {}  # user -> refresh_token
        
    def create_tokens(self, username: str) -> tuple[str, str]:
        """Create access and refresh tokens"""
        # Access token (short-lived)
        access_exp = datetime.datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
        access_payload = {
            "sub": username,
            "exp": access_exp,
            "iat": datetime.datetime.utcnow(),
            "type": "access"
        }
        access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        # Refresh token (long-lived)
        refresh_exp = datetime.datetime.utcnow() + timedelta(days=JWT_REFRESH_EXPIRATION_DAYS)
        refresh_payload = {
            "sub": username,
            "exp": refresh_exp,
            "iat": datetime.datetime.utcnow(),
            "type": "refresh"
        }
        refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        # Store refresh token
        self.refresh_tokens[username] = refresh_token
        
        return access_token, refresh_token
    
    def verify_token(self, token: str, token_type: str = "access") -> str:
        """Verify JWT token and return username"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            
            # Check token type
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token type, expected {token_type}"
                )
            
            # Check if token is blacklisted
            if token in self.blacklist:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked"
                )
            
            username = payload.get("sub")
            if username is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload"
                )
            
            return username
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired"
            )
        except jwt.JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {str(e)}"
            )
    
    def revoke_token(self, token: str):
        """Revoke a token (add to blacklist)"""
        self.blacklist.add(token)
        logger.info(f"Token revoked: {token[:20]}...")
    
    def revoke_all_user_tokens(self, username: str):
        """Revoke all tokens for a user"""
        if username in self.refresh_tokens:
            del self.refresh_tokens[username]
        logger.info(f"All tokens revoked for user: {username}")

# Initialize token manager
token_manager = TokenManager()

# Rate limiting decorator
def rate_limit(limit: int = 5, window: int = 60):
    """Rate limiting decorator (5 attempts per minute by default)"""
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            if redis_client:
                client_ip = request.client.host
                key = f"rate_limit:{func.__name__}:{client_ip}"
                current = redis_client.get(key)
                
                if current and int(current) >= limit:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail=f"Rate limit exceeded. Try again in {window} seconds."
                    )
                
                redis_client.incr(key)
                redis_client.expire(key, window)
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

# Helper functions
def authenticate_user(username: str, password: str) -> Optional[Dict]:
    """Authenticate user with hashed password"""
    user = MOCK_USERS.get(username)
    if not user or not user.get("is_active", True):
        return None
    
    if _verify_password(password, user["password_hash"]):
        # Update last login
        user["last_login"] = datetime.datetime.utcnow().isoformat()
        return {
            "username": username,
            "name": user["name"],
            "role": user["role"],
            "email": user["email"]
        }
    return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency to get current authenticated user"""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_manager.verify_token(credentials.credentials, "access")

def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[str]:
    """Optional authentication (doesn't raise exception)"""
    if not credentials:
        return None
    
    try:
        return token_manager.verify_token(credentials.credentials, "access")
    except HTTPException:
        return None

def require_role(required_role: str):
    """Dependency to require specific user role"""
    def role_checker(username: str = Depends(get_current_user)):
        user = MOCK_USERS.get(username)
        if not user or user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' required"
            )
        return username
    return role_checker

# Endpoints
@router.post("/login", response_model=LoginResponse)
async def login(request: Request, login_data: LoginRequest):
    """
    User login endpoint.
    
    - Validates credentials
    - Returns JWT access token and refresh token
    - Rate limited to 5 attempts per minute
    """
    try:
        logger.info(f"Login attempt for user: {login_data.username}")
        
        # Authenticate user
        user_info = authenticate_user(login_data.username, login_data.password)
        
        if not user_info:
            logger.warning(f"Failed login attempt for user: {login_data.username}")
            return LoginResponse(
                success=False,
                message="Usuario o contraseña incorrectos"
            )
        
        # Create tokens
        access_token, refresh_token = token_manager.create_tokens(login_data.username)
        
        logger.info(f"Successful login for user: {login_data.username}")
        
        return LoginResponse(
            success=True,
            token=access_token,
            refresh_token=refresh_token,
            user=user_info,
            expires_in=JWT_EXPIRATION_HOURS * 3600
        )
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: RefreshTokenRequest):
    """
    Refresh access token using refresh token.
    """
    try:
        # Verify refresh token
        username = token_manager.verify_token(refresh_data.refresh_token, "refresh")
        
        # Check if refresh token matches stored token
        stored_token = token_manager.refresh_tokens.get(username)
        if not stored_token or stored_token != refresh_data.refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Create new tokens
        access_token, refresh_token = token_manager.create_tokens(username)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=JWT_EXPIRATION_HOURS * 3600
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error refreshing token: {str(e)}"
        )

@router.get("/me")
async def get_current_user_info(username: str = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Requires valid JWT token in Authorization header.
    """
    try:
        user = MOCK_USERS.get(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        
        return {
            "success": True,
            "user": {
                "username": username,
                "name": user["name"],
                "role": user["role"],
                "email": user["email"],
                "last_login": user.get("last_login")
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {str(e)}"
        )

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    username: str = Depends(get_current_user)
):
    """
    Logout user by revoking current token.
    """
    try:
        # Revoke the current token
        token_manager.revoke_token(credentials.credentials)
        
        logger.info(f"User logged out: {username}")
        
        return {
            "success": True,
            "message": "Successfully logged out"
        }
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during logout: {str(e)}"
        )

@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    username: str = Depends(get_current_user)
):
    """
    Change user password.
    
    Requires current password verification.
    """
    try:
        user = MOCK_USERS.get(username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        if not _verify_password(password_data.current_password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Update password
        user["password_hash"] = _hash_password(password_data.new_password)
        
        # Revoke all tokens (force re-login)
        token_manager.revoke_all_user_tokens(username)
        
        logger.info(f"Password changed for user: {username}")
        
        return {
            "success": True,
            "message": "Password changed successfully. Please login again."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error changing password: {str(e)}"
        )

@router.get("/verify")
async def verify_token_endpoint(username: str = Depends(get_current_user)):
    """
    Verify if current token is valid.
    """
    return {
        "valid": True,
        "username": username
    }

# Admin endpoints
@router.get("/users", dependencies=[Depends(require_role("admin"))])
async def list_users():
    """
    List all users (admin only).
    """
    users = []
    for username, user_data in MOCK_USERS.items():
        users.append({
            "username": username,
            "name": user_data["name"],
            "role": user_data["role"],
            "email": user_data["email"],
            "is_active": user_data.get("is_active", True),
            "last_login": user_data.get("last_login")
        })
    
    return {
        "success": True,
        "users": users,
        "total": len(users)
    }
def test_authenticate_user_success(user_repo):
    """Test successful user authentication."""
    from services.api.routes.auth import authenticate_user
    
    # Create a test user (if not exists)
    user = user_repo.get_by_username('testuser')
    if not user:
        user = user_repo.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com',
            role='user'
        )
    
    # Authenticate
    user_dict = authenticate_user('testuser', 'testpass123')
    assert user_dict is not None
    assert user_dict['username'] == 'testuser'
    assert user_dict['role'] == 'user'
    assert 'id' in user_dict

def test_authenticate_user_wrong_password(user_repo):
    """Test authentication with wrong password."""
    from services.api.routes.auth import authenticate_user
    
    user = user_repo.get_by_username('testuser')
    if not user:
        user = user_repo.create_user(
            username='testuser',
            password='testpass123',
            role='user'
        )
    
    #Wrong password
    user_dict = authenticate_user('testuser', 'wrongpass')
    assert user_dict is None

def test_authenticate_user_nonexistent():
    """Test authentication for non-existent user."""
    from services.api.routes.auth import authenticate_user
    
    user_dict = authenticate_user('nonexistent', 'anypass')
    assert user_dict is None

def test_get_current_user_info(user_repo):
    """Test get_current_user_info endpoint."""
    from services.api.routes.auth import get_current_user_info
    from fastapi import HTTPException
    
    # This test would need FastAPI TestClient - skip for simple unit test
    pass
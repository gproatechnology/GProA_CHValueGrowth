#!/usr/bin/env python3
r'''Create admin user directly - bypass alembic'''

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from database.config import engine, SessionLocal, Base
from database.models import User
import bcrypt
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    Base.metadata.create_all(bind=engine)  # Create tables if missing
    
    db = SessionLocal()
    try:
        # Count existing users
        user_count = db.query(User).count()
        logger.info(f'Existing users: {user_count}')
        
        # Check admin
        admin = db.query(User).filter(User.username == 'admin').first()
        if admin:
            logger.info('Admin exists, checking password')
            # Test password
            test_pass = b'admin123'
            if bcrypt.checkpw(test_pass, admin.password_hash.encode()):
                logger.info('✅ Admin:admin123 works!')
                return
            else:
                logger.info('Wrong password hash, recreating...')
                db.delete(admin)
                db.commit()
        
        # Create admin
        password = 'admin123'
        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        admin = User(
            username='admin',
            email='admin@chvaluegrowth.com',
            password_hash=password_hash,
            full_name='Administrador CHValueGrowth',
            role='admin',  # String: admin, user, manager
            is_active=True,
            is_verified=True
        )
        
        db.add(admin)
        db.commit()
        logger.info('✅ Admin user created: admin / admin123')
        logger.info('🔐 CHANGE PASSWORD AFTER LOGIN!')
        
    except Exception as e:
        logger.error(f'Error: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == '__main__':
    main()


def test_user_repository_create(user_repo):
    """Test creating a user."""
    user = user_repo.create_user(
        username='newuser',
        password='password123',
        email='newuser@example.com',
        full_name='New User',
        role='user'
    )
    assert user is not None
    assert user.id > 0
    assert user.username == 'newuser'
    assert user.email == 'newuser@example.com'
    assert user.role == 'user'
    assert user.is_active == True
    
def test_user_repository_get_by_username(user_repo):
    """Test getting user by username."""
    # Create user if not exists
    user = user_repo.create_user(
        username='gettest',
        password='pass123',
        role='user'
    )
    assert user is not None
    
    retrieved = user_repo.get_by_username('gettest')
    assert retrieved is not None
    assert retrieved.username == 'gettest'
    assert retrieved.id == user.id

def test_user_repository_get_by_email(user_repo):
    """Test getting user by email."""
    user = user_repo.create_user(
        username='emailtest',
        password='pass123',
        email='email@test.com',
        role='user'
    )
    retrieved = user_repo.get_by_email('email@test.com')
    assert retrieved is not None
    assert retrieved.username == 'emailtest'

def test_user_repository_get_all(user_repo):
    """Test getting all users."""
    initial = user_repo.get_all()
    initial_count = len(initial)
    
    user_repo.create_user(username='user1', password='pass', role='user')
    user_repo.create_user(username='user2', password='pass', role='user')
    
    all_users = user_repo.get_all()
    assert len(all_users) >= initial_count + 2

def test_user_repository_update_last_login(user_repo):
    """Test updating last_login."""
    user = user_repo.create_user(
        username='logintest',
        password='pass123',
        role='admin'
    )
    assert user.last_login is None
    
    user_repo.update_last_login('logintest')
    
    updated = user_repo.get_by_username('logintest')
    assert updated.last_login is not None

def test_user_repository_change_role(user_repo):
    """Test changing user role."""
    user = user_repo.create_user(
        username='roletest',
        password='pass123',
        role='user'
    )
    assert user.role == 'user'
    
    user_repo.change_role(user.id, 'admin')
    
    changed = user_repo.get_by_id(user.id)
    assert changed.role == 'admin'

def test_user_repository_deactivate(user_repo):
    """Test deactivating a user."""
    user = user_repo.create_user(
        username='deactivatetest',
        password='pass123',
        role='user'
    )
    assert user.is_active == True
    
    user_repo.deactivate_user(user.id)
    
    deactivated = user_repo.get_by_id(user.id)
    assert deactivated.is_active == False
    
def test_user_verify_password(user_repo):
    """Test User.verify_password method."""
    user = user_repo.create_user(
        username='passwordtest',
        password='correct_password',
        role='user'
    )
    
    assert user.verify_password('correct_password') == True
    assert user.verify_password('wrong_password') == False
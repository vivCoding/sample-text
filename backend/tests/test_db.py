from database.user import User
from runtests import mongodb
from utils.generate_random import generate_user

good_user = generate_user(good=True)
bad_user = generate_user(good=False)

def test_push_user(mongodb):
    assert User.push(good_user), "Push on user failed"

def test_find_user_with_valid_username(mongodb):
    assert User.find_by_username(good_user.username) == good_user, "Could not find user by username"

def test_find_user_with_invalid_username(mongodb):
    assert User.find_by_username(bad_user.username) is None, "Found nonexistent user by username"

def test_find_user_with_valid_email(mongodb):
    assert User.find_by_email(good_user.email) == good_user, "Could not find user by email"

def test_find_user_with_invalid_email(mongodb):
    assert User.find_by_email(bad_user.email) is None, "Found nonexistent user by email"

def test_update_user_username(mongodb):
    pass

def test_update_user_email(mongodb):
    pass

def test_update_user_password(mongodb):
    pass

def test_delete_user(mongodb):
    pass
from database.user import User
from runtests import mongodb

user = User(username="bob123", email="bob123@gmail.com", password="bobPassword")

def test_push_user(mongodb):
    assert User.push(user), "Push on user failed"

def test_find_user_with_valid_username(mongodb):
    assert User.find_by_username("bob123") == user, "Could not find user by username"

def test_find_user_with_invalid_username(mongodb):
    assert User.find_by_username("random123") is None, "Found nonexistent user by username"

def test_find_user_with_valid_email(mongodb):
    assert User.find_by_email("bob123@gmail.com") == user, "Could not find user by email"

def test_find_user_with_invalid_email(mongodb):
    assert User.find_by_email("random123@gmail.com") is None, "Found nonexistent user by email"

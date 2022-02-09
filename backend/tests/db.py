from asyncio.windows_events import NULL
from database.connect import Connection
from database.user import User
from os import getenv

user1 = User(username="bob123", email="bob123@gmail.com", password="bobPassword")
user2 = User(username="alice456", email="alice456@purdue.edu", password="alicePassword")

def test_push_user():
    assert User.push(user1)
    assert User.push(user2)

def test_find_user_by_username():
    assert User.find_by_username("bob123") == user1
    assert User.find_by_username("randomUsername") is NULL

def test_find_user_by_email():
    assert User.find_by_email("alice456@purdue.edu") == user2
    assert User.find_by_email("random@gmail.com") is NULL


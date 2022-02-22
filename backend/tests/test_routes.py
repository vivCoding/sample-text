from flask import session
from runtests import test_client
from database.user import User
from utils import generate_random

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"

def test_user_creation(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
            })
        data = response.json

        assert response.status_code == 200
        assert data["success"] == True, "User creation test failed"
        assert user.username in session, "User session not added"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)
    
def test_bad_email(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
        "username": user.username,
        "email": f"{user.username}atgmail.com",
        "password": user.password
        })
    
    data = response.json
    if User.find_by_email(user.email):
        User.delete_by_email(user.email)
    assert response.status_code == 200
    assert data["success"] == False and (data["error"] == 3), "Bad Email Assertion Failed"

def test_bad_password(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
        "username": user.username,
        "email": user.email,
        "password": "123456789101112131415161718"
        })
    data = response.json
    if User.find_by_email(user.email):
        User.delete_by_email(user.email)
    assert response.status_code == 200
    assert data["success"] == False and (data["error"] == 4), "Bad Password Assertion Failed"

def test_login_nonexisting(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/login", json={
        "username": user.username,
        "password": user.password
    })
    data = response.json

    assert response.status_code == 200
    assert data["success"] == True and data["error"] == 1, "Login nonexisting user failed"

def test_login_existing(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
        })

        assert response.status_code == 200

        response = test_client.post("/api/user/login", json={
            "username": user.username,
            "password": user.password
        })
        data = response.json

        assert response.status_code == 200 or response.status_code == 302
        assert data["success"] == True, "Login to existing user test failed"
        assert user.username in session, "Username not added to session"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)
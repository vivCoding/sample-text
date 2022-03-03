from flask import session
from runtests import test_client
from database.user import User
from utils import generate_random

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"

def test_user_creation(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
            })
        data = response.json

        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"User creation test failed for: {str(user.to_dict())}, error: {data.get('error', None)}"
        assert user.username == session.get("username", None), "User session not added for: " + user.username
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()
    
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
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and (data["error"] == 3), f"Bad Email Assertion failed for: {user.username}, {user.email}, got success {data.get('sucess', None)} and error {data.get('error', None)}"
    test_client.cookie_jar.clear()

def test_create_bad_password(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": "123456789101112131415161718"
        })
    data = response.json
    if User.find_by_email(user.email):
        User.delete_by_email(user.email)
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and (data["error"] == 4), f"Bad Password Assertion Failed for: {user.password}, got success {data.get('sucess', None)} and error {data.get('error', None)}"
    test_client.cookie_jar.clear()

def test_login_nonexisting_username(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/login", json={
        "loginField": user.username,
        "password": user.password
    })
    data = response.json

    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and data["error"] == 1, f"Login nonexisting user failed for {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
    
    test_client.cookie_jar.clear()

def test_login_wrong_password(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
        })

        assert response.status_code == 200, "Bad create account response, got " + str(response.status_code)
        test_client.cookie_jar.clear()

        response = test_client.post("/api/user/login", json={
            "loginField": user.username,
            "password": "wrong"
        })
        data = response.json

        assert response.status_code == 200, "Bad login account response, got " + str(response.status_code)
        assert data["success"] == False and data["error"] == 1, f"Login wrong password failed for {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()

def test_login_existing(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
        })

        assert response.status_code == 200, "Bad create account response, got " + str(response.status_code)
        test_client.cookie_jar.clear()

        response = test_client.post("/api/user/login", json={
            "loginField": user.username,
            "password": user.password
        })
        data = response.json

        assert response.status_code == 200, "Bad login account response, got " + str(response.status_code)
        assert data["success"] == True, f"Login to existing user test failed for {user.username}, got success {data.get('sucess', None)} and error {data.get('error', None)}"
        assert user.username == session.get("username", None), f"Username {user.username} not added to session"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()
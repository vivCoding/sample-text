import email
from hashlib import new
import profile
from re import A
from unicodedata import name
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
        assert session["username"] == user.username, "User session not added"
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

def test_delete_account(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Creating user in update profile test failed"

        response = test_client.post("/api/user/delete", json={
            "username": user.username,
            "email" : user.email,
            "password": user.password
        })
        data = response.json
        
        assert response.status_code == 200
        assert data["success"] == True, "Delete user profile test failed"
        deleted_user = User.find_by_email(user.email)
        assert deleted_user is None, "User deletion failed"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)

def test_edit_profile_username(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200
        
        new_username = generate_random.generate_user(True).username

        response = test_client.post("/api/user/editprofile", json={
            "username": new_username,
            "email" : user.email,
            "password": user.password
        })

        data = response.json
        dbuser = User.find_by_username(new_username)
        
        
        assert response.status_code == 200
        assert data["success"] == True, "Updating username test failed"
        assert session['username'] == new_username, "Session username mismatch"
        assert dbuser.username == new_username and dbuser.password == user.password, "Mismatch in db and new user"


    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)

def test_edit_profile_password(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Creating user in update profile test failed"
        
        new_user_pass = generate_random.generate_user(True).password

        response = test_client.post("/api/user/editprofile", json={
            "username": user.username,
            "email" : user.email,
            "password": new_user_pass
        })

        data = response.json
        dbuser = User.find_by_username(user.username)

        
        assert response.status_code == 200
        assert data["success"] == True, "Updating password test failed"
        assert dbuser.username == user.username and dbuser.password == new_user_pass, "Mismatch in db and new user"

    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)

def test_edit_profile_email(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Creating user in update profile test failed"
        
        new_user_email = generate_random.generate_user(True).email

        response = test_client.post("/api/user/editprofile", json={
            "username": user.username,
            "email" : new_user_email,
            "password": user.password
        })

        data = response.json
        dbuser = User.find_by_email(new_user_email)

        
        assert response.status_code == 200, "Connection was not established"
        assert data["success"] == True, "Updating email test failed"
        assert dbuser is not None, "Database info mismatch"

    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if User.find_by_email(new_user_email):
            User.delete_by_email(new_user_email)
        if user.username in session:
            session.pop(user.username)

def test_edit_profile_credentials(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Creating user in update profile test failed"

        response = test_client.post("/api/user/editprofile", json={
            "username": user.username,
            "email" : user.email,
            "password": user.password,
            "name": "Aldiyar",
            "bio": "cool guy",
            "profile_img": "12345678"
        })
        data = response.json

        
        assert response.status_code == 200 or response.status_code == 302
        assert data["success"] == True, "Updating user profile test failed"

        new_user = User.find_by_email(user.email)
        assert new_user is not None, "User does not exist"
        assert new_user.name == "Aldiyar" and new_user.bio == "cool guy" and new_user.profile_img == "12345678", "Bad credentials returned in update profile test"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if user.username in session:
            session.pop(user.username)
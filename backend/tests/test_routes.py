from cgi import test
from flask import Flask, jsonify
from tkinter.tix import Tree
from urllib import response
from click import password_option
from runtests import test_client
from flask.testing import FlaskClient
from database.user import User
from utils import generate_random

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"

def test_user_creation(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
        "username": user.username,
        "email": user.email,
        "password": user.password
        })
    data = response.json
    assert response.status_code == 200
    assert data["success"] == True, "User creation test failed"
    User.delete_by_email(user.email)
    

def test_bad_email(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
        "username": user.username,
        "email": f"{user.username}atgmail.com",
        "password": user.password
        })
    data = response.json
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
    assert response.status_code == 200
    assert data["success"] == False and (data["error"] == 4), "Bad Password Assertion Failed"

from cgi import test
from flask import Flask, jsonify
from tkinter.tix import Tree
from urllib import response
from click import password_option
from runtests import test_client
from flask.testing import FlaskClient
from database.user import User

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"

def test_user_creation(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": "aorak",
        "email": "aorak@purdue.edu",
        "password": "CS307iscool!"
        })
    data = response.json
    assert response.status_code == 200
    assert data["success"] == True, "User creation test failed"

def test_bad_email(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": "zhop",
        "email": "aorakatpurdue.edu",
        "password": "CS307iscool!"
        })
    data = response.json
    assert response.status_code == 200
    assert data["success"] == False and (data["error"] == 3), "Bad email assertion failed"

def test_bad_password(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": "pass",
        "email": "pass@purdue.edu",
        "password": "12345678910111213141516171819202122"
        })
    data = response.json
    assert response.status_code == 200
    assert data["success"] == False and (data["error"] == 4), "Bad Password assertion failed"


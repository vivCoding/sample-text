from cgi import test
from flask import Flask, jsonify
from urllib import response
from click import password_option
from runtests import test_client
from flask.testing import FlaskClient
from database.user import User
from utils import generate_random
import test_check_creation_fields

goodusername = test_check_creation_fields.generate_good_username()
goodemail = test_check_creation_fields.generate_good_email()
badusername = test_check_creation_fields.generate_bad_username
bademail = "12345"
badpass = "123"
goodpass = "12345678"

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"

def test_user_creation(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": goodusername,
        "email": goodemail,
        "password": goodpass
        })
    data = response.json
    if User.find_by_email(goodemail):
        User.delete_by_email(goodemail)
    assert response.status_code == 200, "User Creation Test: Status Code " + response.status_code
    assert data["success"] == True, "User Creation Test: "
    
    
def test_bad_email(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": goodusername,
        "email": bademail,
        "password": goodpass
        })
    
    data = response.json
    if User.find_by_email(goodemail):
        User.delete_by_email(goodemail)
    assert response.status_code == 200, "Bad Email Test: Status Code " + response.status_code
    assert data["success"] == False, "Bad Email Test: No Connection"
    assert (data["error"] == 3), "Bad Email Test: creation test error "


def test_bad_password(test_client):
    response = test_client.post("/api/user/createaccount", json={
        "username": goodusername,
        "email": goodemail,
        "password": badpass
        })
    data = response.json
    if User.find_by_email(goodemail):
        User.delete_by_email(goodemail)
    assert response.status_code == 200, "Bad Password Test: Status Code " + response.status_code
    assert data["success"] == False, "Bad Password Test: No Connection"
    assert (data["error"] == 4), "Bad Password Test: creation test error " + data["error"]

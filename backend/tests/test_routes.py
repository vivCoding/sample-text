from cgi import test
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
    data = response.get_data(as_text=True)
    assert response.status_code == 200
    assert data["success"] == "true"

    

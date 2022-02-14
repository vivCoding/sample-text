from runtests import test_client
from flask.testing import FlaskClient

def test_index(test_client):
    response = test_client.get("/")
    assert response.status_code == 200, "Could not get index route!"
    data = response.data
    assert "Hello world!" in data, "Wrong contents!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"
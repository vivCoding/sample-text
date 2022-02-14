from database.user import User
from runtests import mongodb
from runtests import test_client
from flask.testing import FlaskClient

# Example test functions (delete afterwards)
# NOTE: ALL TEST FUNCTIONS MUST START WITH PREFIX `test_`
def test_hello_world():
    s = "Hello world"
    assert s == "Hello world", "Failed assert equal!"

def test_string():
    s = "hello world"
    assert s.islower() == True, "Failed lower!"
    assert s.isupper() == False, "Failed upper!"

# To have access to the db, import `mongodb` fixture from runtests and pass parameter like so
def test_db(mongodb):
    assert User.find_by_username("bob") is not None, "Could not find bob!"

# To test flask, import `test_client` fixture from runtests and pass parameter like so
def test_index_route(test_client):
    # test_client is type FlaskClient. You can do `get`, `post`, and pass in request headers and stuff
    # https://flask.palletsprojects.com/en/2.0.x/testing/
    result = test_client.get("/")
    assert result.status_code == 200, "Could not get index route!"
    assert test_client.get("/api/user/").status_code == 200, "Could not get user index route!"

# TODO: Add test functions to run starting with 'test_'

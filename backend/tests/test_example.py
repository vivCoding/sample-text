from database.user import User
from runtests import test_client, mongodb

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
    if User.find_by_username("bob") is None:
        user = User("bob", "frankieray12345@gmail.com", "password")
        assert user.push() is not None, "Could not push bob!"
    assert User.find_by_username("bob") is not None, "Could not find bob!"
    # make sure you clean up resources afterwards!
    User.delete_by_username("bob")

# To test flask, import `test_client` fixture from runtests and pass parameter like so
def test_index_route(test_client):
    # test_client is type FlaskClient. You can do `get`, `post`, and pass in request headers and stuff
    # https://flask.palletsprojects.com/en/2.0.x/testing/
    result = test_client.get("/")
    assert result.status_code == 200, "Could not get index route!"
    # it would be wise to clean up cookies after a test.
    # Also you can clear cookies during the middle of a test, like creating account, clear cookie, then test logging in
    test_client.cookie_jar.clear()

# Add test functions to run starting with 'test_'

import imp
from urllib import response
from flask import Flask
import json
from flask_pytest_example.handlers.routes import configure_routes

def test_index():
    app = Flask("__name__")
    configure_routes(app)
    client = app.test_client()
    url = '/'
    response = client.get(url)

    assert response.get_data() == "Hello world!"
    assert response.status_code == 200
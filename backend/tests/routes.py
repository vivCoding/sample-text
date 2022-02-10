from urllib import response
from flask import Flask
from flask import Blueprint, jsonify, request
'''
Module not Found error here when
pytest tests/routes.py do not know how to link app.py
'''
import app

def test_index():
    client = app.test_client()
    url = '/'
    response = client.get(url)
    data = response.data
    assert "Hello world" in data
    assert response.status_code == 200
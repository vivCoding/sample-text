import random
from uuid import uuid4
from database.user import User
from utils.check_creation_fields import check_creation_fields
from utils.generate_random import *
from runtests import mongodb

good_password_characters = r"""~`!@#$%^&*()_-+={[}]|:;'"<,>.?\/"""
bad_email = "12345"
good_pass = "12345678"

def test_good_user(mongodb):
    status = check_creation_fields(generate_good_username(), generate_good_email(), good_pass)
    assert status == 0, "Failed test for all valid fields"

def test_bad_user():
    username = generate_bad_username()
    print(username)
    status = check_creation_fields(username, generate_good_email(), good_pass)
    assert status == 1 or status == 2, "Failed test for bad username"

def test_empty_user():
    status = check_creation_fields("", generate_good_email(), good_pass)
    assert status == 1, "Failed test for empty username"

def test_empty_pass():
    status = check_creation_fields(generate_good_username(), generate_good_email(), "")
    assert status == 4, "Failed test for empty password"

def test_bad_email():
    status = check_creation_fields(generate_good_username(), bad_email, good_pass)
    assert status == 3, "Failed test for bad email"

def test_existing_email(mongodb):
    username = generate_good_username()
    email = generate_good_email()
    User(username, email, good_pass).push()
    status = check_creation_fields(generate_good_username(), email, good_pass)
    assert status == 7, "Failed test for existing email"

def test_existing_user(mongodb):
    username = generate_good_username()
    email = generate_good_email()
    User(username, email, good_pass).push()
    status = check_creation_fields(username, generate_good_email(), good_pass)
    assert status == 6, "Failed test for existing user"
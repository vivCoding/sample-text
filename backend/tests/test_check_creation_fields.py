import random
from uuid import uuid4
from database.user import User
from utils.check_creation_fields import check_creation_fields
from runtests import mongodb

good_username_characters = "-_."
bad_username_characters = r"""~`!@#$%^&*()+={[}]|:;'"<,>?\/"""
good_password_characters = r"""~`!@#$%^&*()_-+={[}]|:;'"<,>.?\/"""
bad_email = "12345"
good_pass = "12345678"

def generate_good_username():
    sze = random.randint(1, 20)
    ret = ""
    for i in range(sze):
        c = random.randrange(62 + len(good_username_characters))
        if c <= 25:
            ret += chr(ord('a')+c)
        elif c <= 51:
            ret += chr(ord('A')+c-26)
        elif c <= 61:
            ret += chr(ord('0')+c-52)
        else:
            ret += good_username_characters[c-62]
    return ret

def generate_bad_username():
    sze = random.randint(0, 50)
    ret = ""
    for i in range(sze):
        c = random.randrange(62 + len(good_username_characters) + len(bad_username_characters))
        if c <= 25:
            ret += chr(ord('a')+c)
        elif c <= 51:
            ret += chr(ord('A')+c-26)
        elif c <= 61:
            ret += chr(ord('0')+c-52)
        elif c <= 64:
            ret += good_username_characters[c-62]
        else:
            ret += bad_username_characters[c-65]
    if sze > 0:
        ret += bad_username_characters[random.randrange(0, len(bad_username_characters))]
    return ret

def generate_good_email():
    return uuid4().hex + "@gmail.com"

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
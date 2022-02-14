import random
from utils.check_creation_fields import check_creation_fields

good_username_characters = "-_."
bad_username_characters = """~`!@#$%^&*()+={[}\]|\:;'"<,>?\/"""
good_password_characters = """~`!@#$%^&*()_-+={[}\]|\:;'"<,>.?\/"""
existing_user = "bob"
existing_email = "frankieray12345@gmail.com"
nonexisting_email = "qud@purdue.edu"
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

def test_good_user():
    status = check_creation_fields(generate_good_username(), nonexisting_email, good_pass)
    assert status == 0, "Failed test for all valid fields"

def test_bad_user():
    status = check_creation_fields(generate_bad_username(), nonexisting_email, good_pass)
    assert status == 1 or status == 2, "Failed test for bad username"

def test_empty_user():
    status = check_creation_fields("", nonexisting_email, good_pass)
    assert status == 1, "Failed test for empty username"

def test_empty_pass():
    status = check_creation_fields(generate_good_username(), nonexisting_email, "")
    assert status == 4, "Failed test for empty password"

def test_bad_email():
    status = check_creation_fields(generate_good_username(), bad_email, good_pass)
    assert status == 3, "Failed test for bad email"

def test_existing_email():
    status = check_creation_fields(generate_good_username(), existing_email, good_pass)
    assert status == 7, "Failed test for existing email"

def test_existing_user():
    status = check_creation_fields(existing_user, nonexisting_email, good_pass)
    assert status == 6, "Failed test for existing user"
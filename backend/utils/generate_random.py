import random
from database.user import User

good_username_characters = "-_."
bad_username_characters = r"""~`!@#$%^&*()+={[}]|:;'"<,>?\/"""

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

def generate_user(good):
    username = generate_bad_username() if not good else generate_good_username()
    email = f"{username}@gmail.com"
    password = "password"
    return User(username, email, password)

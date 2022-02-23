from validate_email import validate_email
from database.user import User
import re

good_username = re.compile(r"[a-zA-Z0-9\-_.]{1,20}")
good_password = re.compile(r"[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|:;'\"<,>.?\/]{8,25}")

# Checks if new account information is valid, returns an integer status code
# 0 - Fields are valid
# 1 - Username length is not between 1 and 20, inclusive
# 2 - Username contains invalid characters
# 3 - Email is not a valid email
# 4 - Password length is not between 8 and 25, inclusive
# 5 - Password contains invalid characters
# 6 - A user with the desired username already exists
# 7 - A user with the desired email address already exists

def check_creation_fields(username, email, password) -> int:
    username_result = check_username(username)
    email_result = check_email(email)
    password_result = check_password(password)
    if username_result is not 0:
        return username_result
    if email_result is not 0:
        return email_result
    if password_result is not 0:
        return password_result
    return 0

def check_username(username):
    if len(username) < 1 or len(username) > 20:
        return 1
    if good_username.fullmatch(username) is None:
        return 2
    if User.find_by_username(username) is not None:
        return 6
    return 0

def check_email(email):
    if not validate_email(email, check_smtp=False):
        return 3
    if User.find_by_email(email) is not None:
        return 7
    return 0

def check_password(password):
    if len(password) < 8 or len(password) > 25:
        return 4
    if good_password.fullmatch(password) is None:
        return 5
    return 0
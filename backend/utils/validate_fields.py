from typing import Tuple
from validate_email import validate_email
from database.user import User
import re

good_username = re.compile(r"[a-zA-Z0-9\-_.]{1,20}")
good_password = re.compile(r"[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|:;'\"<,>.?\/]{8,25}")

# Checks if new account information is valid, returns a tuple with the integer status code and an success/error message
# 0 - Fields are valid
# 1 - Username length is not between 1 and 20, inclusive
# 2 - Username contains invalid characters
# 3 - Email is not a valid email
# 4 - Password length is not between 8 and 25, inclusive
# 5 - Password contains invalid characters
# 6 - A user with the desired username already exists
# 7 - A user with the desired email address already exists

def check_account_fields(username, email, password) -> Tuple[int, str]:
    username_result = check_username(username)
    email_result = check_email(email)
    password_result = check_password(password)
    if username_result[0] != 0:
        return username_result
    if email_result[0] != 0:
        return email_result
    if password_result[0] != 0:
        return password_result
    return 0, ""

def check_username(username) -> Tuple[int, str]:
    if len(username) < 1 or len(username) > 20:
        return 1, "Username length must contain 1 to 20 characters!"
    if good_username.fullmatch(username) is None:
        return 2, "Username must be only contain letters, numbers, periods, dashes, and underscores"
    if User.find_by_username(username) is not None:
        return 6, "Username already exists!"
    return 0, ""

def check_email(email) -> Tuple[int, str]:
    if not validate_email(email, check_smtp=False):
        return 3, "Invalid email!"
    if User.find_by_email(email) is not None:
        return 7, "Email already exists!"
    return 0, ""

def check_password(password) -> Tuple[int, str]:
    if len(password) < 8 or len(password) > 25:
        return 4, "Password length must contain 8 to 25 characters!"
    if good_password.fullmatch(password) is None:
        return 5, "Password length contains invalid characters!"
    return 0, ""

def check_comment(comment) -> Tuple[int, str]:
    if len(comment) == 0 or len(comment) > 500:
        return 1, "Comment length is invalid"
    return 0, ""
from validate_email import validate_email
from database.user import User
import re

# Checks if new account information is valid, returns an integer status code
# 0 - Fields are valid
# 1 - Username length is not between 1 and 20, inclusive
# 2 - Username contains invalid characters
# 3 - Email is not a valid email
# 4 - Password length is not between 8 and 25, inclusive
# 5 - Password contains invalid characters
# 6 - A user with the desired username already exists
# 7 - A user with the desired email address already exists

def checkCreationFields(username, email, password) -> int:
    if len(username) < 1 or len(username) > 20:
        return 1
    if not re.match(r"""[a-zA-Z0-9\-_.]{1,20}""", username):
        return 2
    if not validate_email(email):
        return 3
    if len(password) < 8 or len(password) > 25:
        return 4
    if not re.match(r"""[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\:;'"<,>.?\/]{8,25}""", password):
        return 5
    if User.find_by_username(username):
        return 6
    if User.find_by_email(email):
        return 7
    return 0


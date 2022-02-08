from validate_email import validate_email
import re

def checkCreationFields(username, email, password) -> int:
    if len(username) < 1 or len(username) > 20:
        return 1        # username length must be in [1, 20]
    if not re.match(r"""[a-zA-Z0-9\-_.]{1,20}""", username):
        return 2        # username contains invalid characters
    if not validate_email(email):
        return 3        # email not valid
    if len(password) < 8 or len(password) > 25:
        return 4        # password length must be in [8, 25]
    if not re.match(r"""[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\:;'"<,>.?\/]{8,25}""", password):
        return 5        # password contains invalid characters
    # check if username is in db here
    # check if email is in db here
    return 0            # fields are all valid


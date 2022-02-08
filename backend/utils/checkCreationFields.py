from validate_email import validate_email
import re

def checkCreationFields(username, email, password) -> int:
    if len(username) < 1 or len(username) > 20:
        return 1        # username length must be in [1, 20]
    if not re.match(r"""[a-zA-Z0-9\-_.]{1,20}""", username):
        return 2        # username contains invalid characters
    # check if username is in db here
    if not validate_email(email):
        return 4        # email not valid
    # check if email is in db here
    if len(password) < 8 or len(password) > 25:
        return 6        # password length must be in [8, 25]
    if not re.match(r"""[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\:;'"<,>.?\/]{8,25}""", password):
        return 7        # password contains invalid characters
    return 0            # fields are all valid


from validate_email import validate_email
import re

def checkCreationFields(username, email, password) -> int:
    if username == "":  # empty username
        return 1
    # check if username is in db here
    if not validate_email(email):
        return 3        # email not valid
    # check if email is in db here
    if len(password) < 8 or len(password) > 25:
        return 5        # password length must be in [8, 25]
    if not re.match(r"""[a-zA-Z0-9~`!@#$%^&*()_\-+={[}\]|\:;'"<,>.?\/]{8,25}""", password):
        return 6        # password contains invalid characters


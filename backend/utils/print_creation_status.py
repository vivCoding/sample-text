# prints out the meaning of return codes from c
# useful for printing results of tests
# returns 0 if print was successful, otherwise -1

returnCodes = ["all fields are valid",
               "username length must be between 1 and 20 characters",
               "username contains invalid characters",
               "email is not valid",
               "password length must be between 8 and 25 characters",
               "password contains invalid characters",
               "a user with that username already exists",
               "a user with that email already exists"]

def printCreationFieldCode(ret) -> int:
    if ret < 0 or ret > 7:
        return -1
    print(returnCodes[ret])
    return 0

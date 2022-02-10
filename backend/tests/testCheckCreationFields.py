import random
from backend.utils.checkCreationFields import checkCreationFields

goodUsernameCharacters = "-_."
badUsernameCharacters = """~`!@#$%^&*()+={[}\]|\:;'"<,>?\/"""
goodPasswordCharacters = """~`!@#$%^&*()_-+={[}\]|\:;'"<,>.?\/"""
existingUser = "bob"
existingEmail = "frankieray12345@gmail.com"
nonexistingEmail = "qud@purdue.edu"
badEmail = "12345"
goodPass = "12345678"

def generateGoodUsername():
    sze = random.randint(1, 20)
    ret = ""
    for i in range(sze):
        c = random.randrange(62 + len(goodUsernameCharacters))
        if c <= 25:
            ret += chr(ord('a')+c)
        elif c <= 51:
            ret += chr(ord('A')+c-26)
        elif c <= 61:
            ret += chr(ord('0')+c-52)
        else:
            ret += goodUsernameCharacters[c-62]
    return ret

def generateBadUsername():
    sze = random.randint(0, 50)
    ret = ""
    for i in range(sze):
        c = random.randrange(62 + len(goodUsernameCharacters) + len(badUsernameCharacters))
        if c <= 25:
            ret += chr(ord('a')+c)
        elif c <= 51:
            ret += chr(ord('A')+c-26)
        elif c <= 61:
            ret += chr(ord('0')+c-52)
        elif c <= 64:
            ret += goodUsernameCharacters[c-62]
        else:
            ret += badUsernameCharacters[c-65]
    if sze > 0:
        ret += badUsernameCharacters[random.randrange(0, len(badUsernameCharacters))]
    return ret

def checkGoodUser():
    status = checkCreationFields(generateGoodUsername(), nonexistingEmail, goodPass)
    assert status == 0

def checkBadUser():
    status = checkCreationFields(generateBadUsername(), nonexistingEmail, goodPass)
    assert status == 1 or status == 2

def checkEmptyUser():
    status = checkCreationFields("", nonexistingEmail, goodPass)
    assert status == 1

def checkEmptyPass():
    status = checkCreationFields(generateGoodUsername(), nonexistingEmail, "")
    assert status == 4

def checkBadEmail():
    status = checkCreationFields(generateGoodUsername(), badEmail, goodPass)
    assert status == 3

def checkExistingEmail():
    status = checkCreationFields(generateGoodUsername(), existingEmail, goodPass)
    assert status == 7

def checkExistingUser():
    status = checkCreationFields(existingUser, nonexistingEmail, goodPass)
    assert status == 6
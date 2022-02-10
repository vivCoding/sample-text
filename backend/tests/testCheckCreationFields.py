import random
from backend.utils.checkCreationFields import checkCreationFields

goodUsernameCharacters = "-_."
badUsernameCharacters = """~`!@#$%^&*()+={[}\]|\:;'"<,>?\/"""
goodPasswordCharacters = """~`!@#$%^&*()_-+={[}\]|\:;'"<,>.?\/"""
goodEmail = "frankieray12345@gmail.com"
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
    return ret;

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
    status = checkCreationFields(generateGoodUsername(), goodPass, goodEmail)
    assert status == 0

def checkBadUser():
    status = checkCreationFields(generateBadUsername(), goodPass, goodEmail)
    assert status == 1 or status == 2

def checkEmptyUser():
    status = checkCreationFields("", goodPass, goodEmail)
    assert status == 1

def checkEmptyPass():
    status = checkCreationFields(generateGoodUsername, "", goodEmail);
    assert status == 4
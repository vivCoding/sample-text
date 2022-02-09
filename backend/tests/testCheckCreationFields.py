import random
from backend.utils.checkCreationFields import checkCreationFields

goodUsernameCharacters = "-_."
badUsernameCharacters = """~`!@#$%^&*()+={[}\]|\:;'"<,>?\/"""
goodPasswordCharacters = """~`!@#$%^&*()_-+={[}\]|\:;'"<,>.?\/"""
goodEmail = "frankieray12345@gmail.com"

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
    assert checkCreationFields(generateGoodUsername(), "12345678", goodEmail) == 0

def checkBadUser():
    assert checkCreationFields(generateBadUsername(), "12345678", goodEmail) == 0

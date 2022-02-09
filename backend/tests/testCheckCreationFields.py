import random
from utils.checkCreationFields import checkCreationFields

goodUsernameCharacters = "-_."
badUsernameCharacters = """~`!@#$%^&*()+={[}\]|\:;'"<,>?\/"""
goodPasswordCharacters = """~`!@#$%^&*()_-+={[}\]|\:;'"<,>.?\/"""
goodEmail = "frankieray12345@gmail.com"

# Generates a random valid username

def goodUsernameGenerator():
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

if __name__ == "__main__":
    assert checkCreationFields(goodUsernameGenerator(), "12345678", goodEmail) == 0

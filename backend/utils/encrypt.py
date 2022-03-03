import hashlib

def encrypt(data: str)->str:
    return hashlib.sha256(data.encode()).hexdigest()
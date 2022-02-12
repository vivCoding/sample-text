from .connect import Connection
from os import getenv

class User:
    collection = "users"

    def __init__(self, username, email, password) -> None:
        # TODO: add other optional profile fields
        self.username = username
        self.email = email
        self.password = password

    def __eq__(self, other) -> bool:
        if isinstance(other, User):
            return self.username == other.username
        return False

    # Pushes this object to MongoDB, and returns whether it was successful
    def push(self) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            doc = {
                "username" : self.username,
                "email" : self.email,
                "password": self.password
            }
            col.insert_one(doc)
            return True
        except Exception as e:
            print (e)
            return False

    # Static method that finds and returns a specific user from the collection based on filters
    @staticmethod
    def find(filters: dict):
        db = Connection.client[Connection.database]
        col = db[User.collection]
        res = col.find_one(filters)
        if res is None:
            return None
        return User(res["username"], res["email"], res["password"])

    @staticmethod
    def find_by_username(username: str):
        return User.find({ "username": username })
    
    @staticmethod
    def find_by_email(email: str):
        return User.find({ "email": email })
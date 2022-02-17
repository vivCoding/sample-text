from .connect import Connection
from os import getenv

class User:
    collection = "users"

    def __init__(self, username, email, password, first_name='', last_name='', bio='', profile_img='') -> None:
        # TODO: add other optional profile fields
        self.username = username
        self.email = email
        self.password = password
        self.first_name = first_name
        self.last_name = last_name
        self.bio = bio
        self.profile_img = profile_img

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

    # Updates this object's username in MongoDB, and returns whether it was successful
    def update_username(self, username) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$set": { "username": username } }
            col.update_one(filter, new_value)
            self.username = username
            return True
        except Exception as e:
            print (e)
            return False

    # Updates this object's email in MongoDB, and returns whether it was successful
    def update_email(self, email) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "email" : self.email }
            new_value = { "$set": { "email": email } }
            col.update_one(filter, new_value)
            self.email = email
            return True
        except Exception as e:
            print (e)
            return False
    
    # Updates this object's password in MongoDB, and returns whether it was successful
    def update_password(self, password) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "password" : self.password }
            new_value = { "$set": { "password": password } }
            col.update_one(filter, new_value)
            self.password = password
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

    # Static method that deletes a specific user from the collection based on filters
    @staticmethod
    def delete(filters: dict):
        db = Connection.client[Connection.database]
        col = db[User.collection]
        res = col.find_one(filters)
        col.delete_one(res)
    
    @staticmethod
    def delete_by_username(username: str):
        User.delete({ "username": username })

    @staticmethod
    def delete_by_email(email: str):
        User.delete({ "email": email })
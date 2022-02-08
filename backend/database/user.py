from .connect import Connection

class User:
    database = "sample-text-db"
    collection = "users"

    def __init__(self, mongo_client, username="bob123", email="bob123@gmail.com", password="pa55word") -> None:
        # TODO: initialize values from parameters
        self.mongo_client = mongo_client
        self.user_id = ''
        self.username = username
        self.email = email
        self.password = password

    # Pushes this object to MongoDB, and returns whether it was successful
    def push(self) -> bool:
        # TODO: implement
        if self.mongo_client is None:
            return False
        try: 
            db = self.mongo_client[User.database]
            col = db[User.collection]
            doc = {
                "user_id" : self.user_id,
                "username" : self.username,
                "email" : self.email,
                "password": self.password
            }
            col.insert_one(doc)
        except:
            return False
        return True

    # Static method that finds and returns a specific user from the collection
    @staticmethod
    def find(user_id):
        # TODO: implement
        db = Connection.client[User.database]
        col = db[User.collection]
        doc = {"user_id" : user_id}
        res = col.find_one(doc)
        return User(res["user_id"], res["username"], res["email"], res["password"])

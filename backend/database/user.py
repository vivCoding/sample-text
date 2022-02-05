from .connect import Connection

class User:
    collection = "users"

    def __init__(self) -> None:
        # TODO: initialize values from parameters
        self.username = "bob"
        pass

    # Pushes this object to MongoDB, and returns whether it was successful
    def push(self) -> bool:
        # TODO: implement
        # Connection.client
        pass

    # Static method that finds and returns a specific user from the collection
    @staticmethod
    def find():
        # TODO: implement
        return User()


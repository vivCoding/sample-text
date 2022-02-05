from pymongo import MongoClient
from os import getenv

class Connection:

    client: MongoClient = None

    # Initializes MongoDb client (from env), and sets static variable to client
    @staticmethod
    def init() -> bool:
        # TODO: implement
        pass
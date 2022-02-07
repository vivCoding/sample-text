from pymongo import MongoClient
from os import getenv

ATLAS_URL = getenv("ATLAS_URL")

class Connection:

    client: MongoClient = None

    # Initializes MongoDb client (from env), and sets static variable to client
    @staticmethod
    def init() -> bool:
        Connection.client = MongoClient(ATLAS_URL)
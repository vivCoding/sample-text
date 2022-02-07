from http import client
from pymongo import MongoClient
from os import getenv

ATLAS_URL = getenv("ATLAS_URL")

class Connection:

    client: MongoClient = None

    # Initializes MongoDb client (from env), and sets static variable to client
    @staticmethod
    def init() -> bool:
        client = MongoClient(ATLAS_URL)
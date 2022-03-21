from pymongo import MongoClient, IndexModel, ASCENDING
from os import getenv

class Connection:

    client: MongoClient = None
    database = "sample-text-db"

    # Initializes MongoDb client (from env), and sets static variable to client
    @staticmethod
    def init() -> bool:
        if Connection.is_initialized(): return True
        ATLAS_URL = getenv("ATLAS_URL", "")
        assert ATLAS_URL != "", "No ATLAS URL specified!"
        try:
            Connection.client = MongoClient(ATLAS_URL)
            Connection.database += "-" + getenv("ENV", "prod")
            Connection.client[Connection.database]["users"].create_indexes([
                IndexModel([
                    ("username", ASCENDING),
                    ("email", ASCENDING)
                ], unique=True)
            ])
            # TODO: add other collections
            return True
        except Exception as e:
            print (e)
            return False

    @staticmethod
    def is_initialized() -> bool:
        return Connection.client is not None

    @staticmethod
    def set_testing():
        Connection.database = "sample-text-db-tests"

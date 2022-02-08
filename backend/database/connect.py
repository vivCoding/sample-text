from pymongo import MongoClient, IndexModel, ASCENDING
from os import getenv


class Connection:

    client: MongoClient = None
    database = "sample-text-db"

    # Initializes MongoDb client (from env), and sets static variable to client
    @staticmethod
    def init() -> bool:
        ATLAS_URL = getenv("ATLAS_URL", "")
        try:
            if ATLAS_URL == "":
                print ("No atlas url!")
                return False
            Connection.client = MongoClient(ATLAS_URL)
            Connection.database += ("-dev" if getenv("ENV", "prod") == "dev" else "")
            Connection.client[Connection.database]["users"].create_indexes([
                IndexModel([
                    ("username", ASCENDING),
                    ("email", ASCENDING)
                ])
            ])
            # TODO: add other collections
            return True
        except Exception as e:
            print (e)
            return False

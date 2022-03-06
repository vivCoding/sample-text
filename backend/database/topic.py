from .connect import Connection

class Topic:
    collection = "topics"

    def __init__(self, name, posts = None) -> None:
        self.name = name
        if posts is None:
            self.posts = list[str]

    def push(self) -> bool:
        if Connection.client is None:
            return False
        try:
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            doc = {
                "name" : self.name,
                "posts" : self.posts
            }
            col.insert_one(doc)
            return True
        except Exception as e:
            print(e)
            return False

    @staticmethod
    def find(filters: dict):
        try:
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            res = col.find_one(filters)
            if res is None:
                return None
            return Topic(res["name"], res["posts"])
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def find_by_name(name: str):
        return Topic.find({"name": name})
            
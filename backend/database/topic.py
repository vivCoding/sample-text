from .connect import Connection

class Topic:
    collection = "topics"

    def __init__(self, topic_name, posts = None) -> None:
        self.topic_name = topic_name
        self.posts = posts
        if self.posts is None:
            self.posts = []

    def to_dict(self):
        return {
            "topic_name": self.topic_name,
            "posts": self.posts
        }

    def push(self) -> bool:
        if Connection.client is None:
            return False
        try:
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            doc = {
                "topic_name": self.topic_name,
                "posts": self.posts
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
            return Topic(res["topic_name"], res["posts"])
        except Exception as e:
            print(e)
            return None

    @staticmethod
    def find_by_name(topic_name: str):
        return Topic.find({"topic_name": topic_name})

    @staticmethod
    def delete(topic_name: str):
        try:
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            res = col.find_one({"topic_name": topic_name})
            col.delete_one(res)
        except Exception as e:
            print(e)
            return None

    def add_post(self, post_id: str) -> bool:
        if Connection.client is None:
            return False
        try:
            if post_id in self.posts:
                return True
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            filter = { "topic_name": self.topic_name }
            new_value = { "$push": { "posts": post_id}}
            col.update_one(filter, new_value)
            self.posts.append(post_id)
            return True
        except Exception as e:
            print(e)
            return False

    def remove_post(self, post_id: str) -> bool:
        if Connection.client is None:
            return False
        try:
            if post_id not in self.posts:
                return True
            db = Connection.client[Connection.database]
            col = db[Topic.collection]
            filter = { "topic_name": self.topic_name }
            new_value = { "$pull": { "posts": post_id}}
            col.update_one(filter, new_value)
            self.posts.remove(post_id)
            return True
        except Exception as e:
            print(e)
            return False
from .connect import Connection
from datetime import datetime

class Post:
    collection = "posts"

    def __init__(self, title, topics, user_id, img="", caption="", anonymous=False) -> None:
        self.title = title
        self.topics = topics
        self.user_id = user_id
        self.img = img
        self.caption = caption
        self.anonymous = anonymous
        self.likes = 0
        self.comments = []
        self.date = datetime.now().strftime("%m/%d/%Y, %H:%M")

    def to_dict(self):
        return {
            "title" : self.title,
            "topics" : self.topics,
            "user_id": self.user_id,
            "img": self.img,
            "caption": self.caption,
            "anonymous": self.anonymous,
            "likes": self.likes,
            "comments": self.comments,
            "date": self.date
        }

    # Pushes this object to MongoDB, and returns whether it was successful
    def push(self) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            doc = self.to_dict()
            col.insert_one(doc)
            return True
        except Exception as e:
            print (e)
            return False
    

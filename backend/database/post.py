from calendar import c
from .connect import Connection
from datetime import datetime

class Post:
    collection = "posts"

    def __init__(self, title, topics, user_id, img="", caption="", anonymous=False, 
    likes=0, comments=[], date=datetime.now().strftime("%m/%d/%Y, %H:%M"), post_id=""
    ) -> None:
        self.title = title
        self.topics = topics
        self.user_id = user_id
        self.img = img
        self.caption = caption
        self.anonymous = anonymous
        self.likes = likes
        self.comments = comments
        self.date = date
        self.post_id = post_id

    def to_dict(self):
        return {
            "post_id": self.post_id,
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
            # Get post id and perform update
            _id = col.insert_one(doc).inserted_id
            self.post_id = str(_id)
            filter = { "_id" : _id }
            new_value = { "$set": { "post_id": self.post_id } }
            col.update_one(filter, new_value)
            return True
        except Exception as e:
            print (e)
            return False
    
    # Static method that finds and returns a specific post from the collection based on post id
    @staticmethod
    def find(post_id: str):
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            res = col.find_one({'post_id': post_id})
            if res is None:
                return None
            return Post(
                res["title"],
                res["topics"],
                res["user_id"],
                res["img"],
                res["caption"],
                res["anonymous"],
                res["likes"],
                res["comments"],
                res["date"],
                res["post_id"]
            )
        except Exception as e:
            print (e)
            return None
        
    # Static method that deletes a specific post from the collection based on post id
    @staticmethod
    def delete(post_id: str):
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            res = col.find_one({'post_id': post_id})
            col.delete_one(res)
        except Exception as e:
            print (e)
            return None
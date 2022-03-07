from calendar import c
from .connect import Connection
from datetime import datetime

class Post:
    collection = "posts"

    def __init__(self, title, topics, username, img="", caption="", anonymous=False, 
    likes=0, comments=[], date=datetime.now().strftime("%m/%d/%Y, %H:%M"), post_id=""
    ) -> None:
        self.title = title
        self.topics = topics
        self.username = username
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
            "username": self.username,
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
            # TODO: add this post to a list for user with this username
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

    # Updates this object's likes in MongoDB, and returns whether it was successful
    def like(self) -> bool:
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            filter = { "post_id" : self.post_id }
            new_value = { "$set": { "likes": self.likes + 1 } }
            col.update_one(filter, new_value)
            self.likes += 1
            return True
        except Exception as e:
            print (e)
            return False

    # Updates this object's comments in MongoDB, and returns whether it was successful
    def add_comment(self, username: str, comment: str) -> bool:
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            filter = { "post_id" : self.post_id }
            pair = [username, comment]
            new_value = { "$push": {"comments": [{'username': username}, {"comment": comment}]} }
            col.update_one(filter, new_value, upsert=True)
            self.comments.append(pair)
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
                res["username"],
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
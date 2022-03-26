from .connect import Connection
from datetime import datetime
from database.user import User
from bson.objectid import ObjectId

class Post:
    collection = "posts"

    def __init__(self, title, topic, author_id, img="", caption="", anonymous=False, 
        likes=[], comments=[], date=datetime.now().strftime("%m/%d/%Y, %H:%M"), post_id=""
    ) -> None:
        self.title = title
        self.topic = topic
        self.author_id = author_id
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
            "topic" : self.topic,
            "author_id": self.author_id,
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
            # add this post to a list for user with this author id
            user = User.find_by_id(self.author_id)
            if user is not None:
                user.add_post(self.post_id)
            else:
                print("Cannot find the user who made this post")
                return False
            return True
        except Exception as e:
            print (e)
            return False

    # Updates this object's likes in MongoDB, and returns whether it was successful
    def like(self, user_id: str) -> bool:
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            filter = { "post_id" : self.post_id }
            new_value = { "$addToSet": { "likes": user_id } }
            col.update_one(filter, new_value, upsert=True)
            if user_id not in self.likes:
                self.likes.append(user_id)

            usercol = db[User.collection]
            filter = { "_id": ObjectId(user_id) }
            new_value = { "$addToSet": { "liked_posts": self.post_id } }
            usercol.update_one(filter, new_value)

            return True
        except Exception as e:
            print (e)
            return False

    # Updates this object's likes in MongoDB, and returns whether it was successful
    def unlike(self, user_id: str) -> bool:
        try:
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            filter = { "post_id": self.post_id }
            new_value = { "$pull": { "likes": user_id } }
            col.update_one(filter, new_value)
            self.likes.remove(user_id)

            usercol = db[User.collection]
            filter = { "_id": ObjectId(user_id) }
            new_value = { "$pull": { "liked_posts": self.post_id } }
            usercol.update_one(filter, new_value)

            return True
        except Exception as e:
            print(e)
            return False

    # Updates this object's comments in MongoDB, and returns whether it was successful
    def add_comment(self, user_id: str, comment: str) -> bool:
        try: 
            db = Connection.client[Connection.database]
            col = db[Post.collection]
            filter = { "post_id" : self.post_id }
            pair = [user_id, comment]
            new_value = { "$push": {"comments": [{'user_id': user_id}, {"comment": comment}]} }
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
                res["topic"],
                res["author_id"],
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
            user_col = db[User.collection]
            user_col.update_one({'_id': ObjectId(res.get("author_id", "")) }, {
                "$pull": {
                    "posts": post_id
                }
            })

            for _id in res["likes"]:
                filter = { "_id": ObjectId(_id) }
                new_value = { "$pull": { "liked_posts": post_id } }
                user_col.update_one(filter, new_value)

            col.delete_one(res)
        except Exception as e:
            print (e)
            return None
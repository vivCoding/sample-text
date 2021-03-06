import database
from .connect import Connection
from bson.objectid import ObjectId

class User:
    collection = "users"

    def __init__(self,
        username, email, password, name="", bio="", profile_img="", following=[], followers=[],
        followed_topics = [], posts=[], liked_posts = [], disliked_posts=[], loved_posts=[], comments=[], saved_posts=[],
        conversations=[], onlyRecieveMsgFromFollowing=False, user_id="",  blocked=[], blockedBy=[]
    ) -> None:
        self.user_id = user_id
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.bio = bio
        self.profile_img = profile_img
        self.following = following
        self.followers = followers
        self.posts = posts
        self.followed_topics = followed_topics
        self.liked_posts = liked_posts
        self.disliked_posts = disliked_posts
        self.loved_posts = loved_posts
        self.comments = comments
        self.conversations = conversations
        self.saved_posts = saved_posts
        self.blocked = blocked
        self.blockedBy = blockedBy
        self.onlyRecieveMsgFromFollowing = onlyRecieveMsgFromFollowing

    def __eq__(self, other) -> bool:
        if isinstance(other, User):
            return self.username == other.username
        return False

    def to_dict(self):
        return {
            "userId": self.user_id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "bio": self.bio,
            "profileImg": self.profile_img,
            "followers": self.followers,
            "following": self.following,
            "posts": self.posts,
            "followed_topics": self.followed_topics,
            "liked_posts": self.liked_posts,
            "disliked_posts": self.disliked_posts,
            "loved_posts": self.loved_posts,
            "comments": self.comments,
            "saved_posts": self.saved_posts,
            "blocked": self.blocked,
            "blockedBy": self.blockedBy,
            "conversations": self.conversations,
            "message_setting": self.onlyRecieveMsgFromFollowing
        }

    # Pushes this object to MongoDB, and returns the user id if it was successful. If error, return None
    def push(self):
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            doc = {
                "username" : self.username,
                "email" : self.email,
                "password": self.password,
                "name": self.name,
                "bio": self.bio,
                "profile_img": self.profile_img,         
                "following": self.following,
                "followers": self.followers,
                "posts": self.posts,
                "followed_topics": self.followed_topics,
                "liked_posts": self.liked_posts,
                "disliked_posts": self.disliked_posts,
                "loved_posts": self.loved_posts,
                "comments": self.comments,
                "saved_posts": self.saved_posts,
                "blocked": self.blocked,
                "blockedBy": self.blockedBy,
                "conversations": self.conversations,
                "message_setting": self.onlyRecieveMsgFromFollowing
            }
            result = col.insert_one(doc)
            self.user_id = str(result.inserted_id)
            return self.user_id
        except Exception as e:
            print (e)
            return None


    # Updates this object's username in MongoDB, and returns whether it was successful
    def update_username(self, username) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$set": { "username": username } }
            col.update_one(filter, new_value)
            self.username = username
            return True
        except Exception as e:
            print (e)
            return False

    # Updates this object's email in MongoDB, and returns whether it was successful
    def update_email(self, email) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$set": { "email": email } }
            col.update_one(filter, new_value)
            self.email = email
            return True
        except Exception as e:
            print (e)
            return False

    # Adds a post to this object's list of posts in MongoDB, and returns whether it was successful
    def add_post(self, post_id) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$addToSet": { "posts": post_id } }
            col.update_one(filter, new_value, upsert=True)
            if post_id not in self.posts:
                self.posts.append(post_id)
            return True
        except Exception as e:
            print (e)
            return False

    # Adds a post to this object's list of saved posts in MongoDB, and returns whether it was successful
    def save_post(self, post_id) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$addToSet": { "saved_posts": post_id } }
            col.update_one(filter, new_value, upsert=True)
            if post_id not in self.saved_posts:
                self.saved_posts.append(post_id)

            postcol = db["posts"]
            filter = { "post_id": post_id }
            new_value = { "$addToSet": { "saves": self.user_id } }
            postcol.update_one(filter, new_value)
            
            return True
        except Exception as e:
            print (e)
            return False

    def unsave_post(self, post_id) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$pull": { "saved_posts": post_id } }
            col.update_one(filter, new_value, upsert=True)
            if post_id in self.saved_posts:
                self.saved_posts.remove(post_id)

            postcol = db["posts"]
            filter = { "post_id": post_id }
            new_value = { "$pull": { "saves": self.user_id } }
            postcol.update_one(filter, new_value)
            
            return True
        except Exception as e:
            print (e)
            return False
    
    # Updates this object's password in MongoDB, and returns whether it was successful
    def update_password(self, password) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "username" : self.username }
            new_value = { "$set": { "password": password } }
            col.update_one(filter, new_value)
            self.password = password
            return True
        except Exception as e:
            print (e)
            return False
    
    # Updates this object's profile information in MongoDB, and returns whether it was successful
    def update_profile(self, name=None, bio=None, profile_img=None) -> bool:
        if Connection.client is None:
            return False
        old_name = self.name
        old_bio = self.bio
        old_profile_img = self.profile_img
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            if name:
                self.name = name
            if bio:
                self.bio = bio
            if profile_img:
                self.profile_img = profile_img
            new_value = {"$set": {
                "name": self.name,
                "bio": self.bio,
                "profile_img": self.profile_img 
            }}
            col.update_one({ "username" : self.username }, new_value).modified_count
            return True
        except Exception as e:
            print (e)
            self.name = old_name
            self.bio = old_bio
            self.profile_img = old_profile_img
            return False
    
    # Updates this object's password in MongoDB, and returns whether it was successful
    def update_message_setting(self, onlyRecieveMsgFromFollowing) -> bool:
        if Connection.client is None:
            return False
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            filter = { "_id" : ObjectId(self.user_id) }
            new_value = { "$set": { "message_setting": onlyRecieveMsgFromFollowing } }
            col.update_one(filter, new_value)
            self.onlyRecieveMsgFromFollowing = onlyRecieveMsgFromFollowing
            return True
        except Exception as e:
            print (e)
            return False
    
    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - already following
    # 3 - success
    # 4 - in blocked
    def follow(self, user_id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_follow = User.find_by_id(user_id)
            if user_to_follow is None:
                return 1
            if user_id in self.following:
                return 2
            if user_id in self.blocked:
                return 4
            db = Connection.client[Connection.database]
            col = db[User.collection]
            
            self.following.append(user_id)
            user_to_follow.followers.append(self.user_id)

            new_value = { "$set": { "following": self.following } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)

            new_value = { "$set": { "followers": user_to_follow.followers } }
            col.update_one({ "_id" : ObjectId(user_id) }, new_value)

            return 3
        except Exception as e:
            print (e)
            return 0
    
    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - already blocked
    # 3 - success
    def block(self, user_id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_block = User.find_by_id(user_id)
            if user_to_block is None:
                return 1
            if user_id in self.blocked:
                return 2
            db = Connection.client[Connection.database]
            col = db[User.collection]
            
            self.blocked.append(user_id)
            user_to_block.blockedBy.append(self.user_id)

            new_value = { "$set": { "blocked": self.blocked } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)

            new_value = { "$set": { "blockedBy": user_to_block.blockedBy } }
            col.update_one({ "_id" : ObjectId(user_id) }, new_value)

            return 3
        except Exception as e:
            print(e)
            return 0

    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - not in blocked
    # 3 - success
    def unblock(self, user_id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_unblock = User.find_by_id(user_id)
            if user_to_unblock is None:
                return 1
            if user_id not in self.blocked:
                return 2
            db = Connection.client[Connection.database]
            col = db[User.collection]
            self.blocked.remove(user_id)
            user_to_unblock.blockedBy.remove(self.user_id)

            new_value = { "$set": { "blocked": self.blocked } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)
            
            new_value = { "$set": { "blockedBy": user_to_unblock.blockedBy } }
            col.update_one({ "_id" : ObjectId(user_id) }, new_value)

            return 3
        except Exception as e:
            print(user_to_unblock.user_id)
            return 0

    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - not following
    # 3 - success
    def unfollow(self, user_id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_unfollow = User.find_by_id(user_id)
            if user_to_unfollow is None:
                return 1
            if user_id not in self.following:
                return 2
            db = Connection.client[Connection.database]
            col = db[User.collection]
            
            self.following.remove(user_id)
            user_to_unfollow.followers.remove(self.user_id)

            new_value = { "$set": { "following": self.following } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)

            new_value = { "$set": { "followers": user_to_unfollow.followers } }
            col.update_one({ "_id" : ObjectId(user_id) }, new_value)

            return 3
        except Exception as e:
            print (e)
            return 0


    # Tries following a topic, returns whether it was successful
    def follow_topic(self, topic_name) -> bool:
        if Connection.client is None:
            return False
        try:
            if topic_name in self.followed_topics:
                return True
                
            db = Connection.client[Connection.database]
            col = db[User.collection]
            new_value = { "$push": { "followed_topics": topic_name } }
            col.update_one({ "username": self.username }, new_value)
            self.followed_topics.append(topic_name)
            return True
        except Exception as e:
            print(e)
            return False
        
    # Tries unfollowing a topic, returns whether it was successful
    def unfollow_topic(self, topic_name) -> bool:
        if Connection.client is None:
            return False
        try:
            if topic_name not in self.followed_topics:
                return True
            
            db = Connection.client[Connection.database]
            col = db[User.collection]
            new_value = { "$pull": { "followed_topics": topic_name } }
            col.update_one({ "username": self.username }, new_value)
            self.followed_topics.remove(topic_name)
            return True
        except Exception as e:
            print(e)
            return False

    def add_conversation(self, convo_id):
        if Connection.client is None:
            return False
        try:
            if convo_id in self.conversations:
                return False            
            db = Connection.client[Connection.database]
            col = db[User.collection]
            self.conversations.append(str(convo_id))
            new_value = { "$set": { "conversations": self.conversations } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)
            return True
        except Exception as e:
            print(e)
            return False

    def remove_conversation(self, convo_id):
        if Connection.client is None:
            return False
        try:
            if convo_id not in self.conversations:
                return False            
            db = Connection.client[Connection.database]
            col = db[User.collection]
            self.conversations.remove(convo_id)
            new_value = { "$set": { "conversations": self.conversations } }
            col.update_one({ "_id" : ObjectId(self.user_id) }, new_value)
            return True
        except Exception as e:
            print(e)
            return False

    # Static method that finds and returns a specific user from the collection based on filters
    @staticmethod
    def find(filters: dict):
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            res = col.find_one(filters)
            if res is None:
                return None
            return User(
                username=res["username"],
                email=res["email"],
                password=res["password"],
                name=res["name"],
                bio=res["bio"],
                profile_img=res["profile_img"],
                following=res["following"],
                followers=res["followers"],
                posts=res["posts"],
                followed_topics=res["followed_topics"],
                liked_posts=res["liked_posts"],
                disliked_posts=res["disliked_posts"],
                loved_posts=res["loved_posts"],
                comments=res["comments"],
                saved_posts=res["saved_posts"],
                conversations=res["conversations"],
                onlyRecieveMsgFromFollowing=res["message_setting"],
                user_id= str(res["_id"]),
                blocked=res["blocked"],
                blockedBy=res["blockedBy"],
            )
        except Exception as e:
            print (e)
            return None

    @staticmethod
    def find_by_credentials(username: str, hashed_password: str):
        found_user = User.find({ "username": username, "password": hashed_password })
        if found_user is None:
            found_user = User.find({ "email": username, "password": hashed_password })
        return found_user

    @staticmethod
    def find_by_id(user_id: str):
        return User.find({ "_id":  ObjectId(user_id) })

    @staticmethod
    def find_by_username(username: str):
        return User.find({ "username": username })
    
    @staticmethod
    def find_by_email(email: str):
        return User.find({ "email": email })

    # Static method that deletes a specific user from the collection based on filters
    @staticmethod
    def delete(filters: dict):
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            res = col.find_one(filters)

            postcol = db["posts"]
            new_value = { "$pull": { "likes": str(res["_id"]) } }
            for post_id in res["liked_posts"]:
                filter = { "post_id": post_id }
                postcol.update_one(filter, new_value)

            new_value = { "$pull": { "dislikes": str(res["_id"]) } }
            for post_id in res["disliked_posts"]:
                filter = { "post_id": post_id }
                postcol.update_one(filter, new_value)

            new_value = { "$pull": { "loves": str(res["_id"]) } }
            for post_id in res["loved_posts"]:
                filter = { "post_id": post_id }
                postcol.update_one(filter, new_value)

            new_value = { "$pull": { "comments": { "$elemMatch": { "user_id": str(res["_id"]) } } } }
            for post_id in res["comments"]:
                filter = { "post_id": post_id }
                postcol.update_one(filter, new_value)

            new_value = { "$pull": { "saves": str(res["_id"]) } }
            for post_id in res["saved_posts"]:
                filter = { "post_id": post_id }
                postcol.update_one(filter, new_value)

            for follower_id in res["followers"]:
                other_user = User.find_by_id(follower_id)
                other_user.unfollow(str(res["_id"]))

            this_user = User.find_by_id(str(res["_id"]))
            for follower_id in res["following"]:
                this_user.unfollow(follower_id)
            
            for blocked_id in res["blockedBy"]:
                other_user = User.find_by_id(blocked_id)
                other_user.unblock(str(res["_id"]))

            this_user = User.find_by_id(str(res["_id"]))
            for blocked_id in res["blocked"]:
                this_user.unblock(blocked_id)

            col.delete_one({ "_id": ObjectId(str(res["_id"])) })

        except Exception as e:
            print (e)
            return None
    
    @staticmethod
    def delete_by_id(id: str):
        User.delete({ "_id": ObjectId(id) })

    @staticmethod
    def delete_by_username(username: str):
        User.delete({ "username": username })

    @staticmethod
    def delete_by_email(email: str):
        User.delete({ "email": email })

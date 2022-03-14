from .connect import Connection
from bson.objectid import ObjectId

class User:
    collection = "users"

    def __init__(self, username, email, password, id=None, name="", bio="", profile_img="") -> None:
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.bio = bio
        self.profile_img = profile_img
        self.following = []
        self.followers = []

    def __eq__(self, other) -> bool:
        if isinstance(other, User):
            return self.username == other.username
        return False

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "bio": self.bio,
            "profileImg": self.profile_img
        }

    # Pushes this object to MongoDB, and returns whether it was successful
    def push(self) -> bool:
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
                "followers": self.followers
            }
            result = col.insert_one(doc)
            return str(result.inserted_id)
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
            col.update_one({ "username" : self.username }, new_value)
            return True
        except Exception as e:
            print (e)
            self.name = old_name
            self.bio = old_bio
            self.profile_img = old_profile_img
            return False
    
    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - already following
    # 3 - success
    def follow(self, id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_follow = User.find_by_id(id)
            if user_to_follow is None:
                return 1
            if id in self.following:
                return 2
            db = Connection.client[Connection.database]
            col = db[User.collection]
            
            self.following.append(id)
            user_to_follow.followers.append(self.id)

            new_value = { "$set": { "following": self.following } }
            col.update_one({ "_id" : ObjectId(self.id) }, new_value)

            new_value = { "$set": { "followers": user_to_follow.followers } }
            col.update_one({ "_id" : ObjectId(id) }, new_value)

            return 3
        except Exception as e:
            print (e)
            return 0

    # makes current user follow given id
    # 0 - db error
    # 1 - given id isnt valid
    # 2 - not following
    # 3 - success
    def unfollow(self, id) -> int:
        if Connection.client is None:
            return 0
        try:
            user_to_unfollow = User.find_by_id(id)
            if user_to_unfollow is None:
                return 1
            if id not in self.following:
                return 2
            db = Connection.client[Connection.database]
            col = db[User.collection]
            
            self.following.remove(id)
            user_to_unfollow.followers.remove(self.id)

            new_value = { "$set": { "following": self.following } }
            col.update_one({ "_id" : ObjectId(self.id) }, new_value)

            new_value = { "$set": { "followers": user_to_unfollow.followers } }
            col.update_one({ "_id" : ObjectId(id) }, new_value)

            return 3
        except Exception as e:
            print (e)
            return 0


    # Static method that finds and returns a specific user from the collection based on filters
    @staticmethod
    def find(filters: dict):
        try: 
            db = Connection.client[Connection.database]
            col = db[User.collection]
            res = col.find_one(filters)
            if res is None:
                return None
            return User(res["username"], res["email"], res["password"], str(res["_id"]), res["name"], res["bio"], res["profile_img"])
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
    def find_by_id(id: str):
        return User.find({ "_id":  ObjectId(id) })

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
            col.delete_one(res)
        except Exception as e:
            print (e)
            return None
    
    @staticmethod
    def delete_by_id(id: str):
        User.delete({ "_id": ObjectId(id) })

    @staticmethod
    def delete_by_email(email: str):
        User.delete({ "email": email })
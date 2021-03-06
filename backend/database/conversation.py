from time import time
from .connect import Connection
from datetime import datetime
from database.user import User
from bson.objectid import ObjectId

class Conversation:
    collection = "conversations"
    def __init__(self, convo_id, user1, user2, messages=[]):
        self.convo_id = convo_id
        self.user1 = user1
        self.user2 = user2
        self.messages = messages

    def to_dict(self):
        return {
            "convo_id": self.convo_id,
            "user1": self.user1,
            "user2": self.user2,
            "messages": self.messages
        }

    def push(self):
        if Connection.client is None:
            return None
        try: 
            db = Connection.client[Connection.database]
            col = db[Conversation.collection]
            doc = { 
                "user1": self.user1,
                "user2": self.user2,
                "messages": self.messages
            }
            result = col.insert_one(doc)
            self.convo_id = str(result.inserted_id)
            return self.convo_id
        except Exception as e:
            print (e)
            return None
    
    # send msg to convo
    # 0 - db error
    # 1 - user requesting to start convo isnt in recipient's following list
    # 2 - sucess
    def add_message(self, author_id, message):
        if Connection.client is None:
            return 0
        recipientUserId = self.user1
        if author_id == self.user1:
            recipientUserId = self.user2
        recipientUser = User.find_by_id(recipientUserId)
        if recipientUser.onlyRecieveMsgFromFollowing and author_id not in recipientUser.following:
            return 1
        try:
            db = Connection.client[Connection.database]
            col = db[Conversation.collection]
            
            self.messages.append({"author_id": author_id, "message": message, "timestamp": datetime.now().strftime('%Y/%m/%d, %H:%M:%S')})

            new_value = { "$set": { "messages": self.messages } }
            col.update_one({ "_id" : ObjectId(self.convo_id) }, new_value)

            return 2
        except Exception as e:
            print (e)
            return 0

    # create convo given 2 user ids
    # 0 - recipient user id doesn't exist
    # 1 - user requesting to start convo isnt in recipient's following list
    # 2 - db error 
    # 3 - success
    # 4 - convo already exits
    # 5 - can't create convo w/ yourself
    @staticmethod
    def create(user: str, recipient: str):
        recipientUser = User.find_by_id(recipient)
        if User.find_by_id(user) == None or recipientUser == None:
            return 0, None
        if user == recipient:
            return 5, None
        if recipientUser.onlyRecieveMsgFromFollowing and user not in recipientUser.following:
            return 1, None
        if Conversation.find_by_participants(user, recipient) == None: #convo doesn't exist -> can create
            conversation_id = Conversation(None, user, recipient, []).push()
            if conversation_id == None: #convo failed to push to db
                return 2, None
            User.find_by_id(user).add_conversation(conversation_id)
            recipientUser.add_conversation(conversation_id)
            return 3, conversation_id
        return 4, None

    @staticmethod
    def delete(conversation_id: str):
        try: 
            currConvo = Conversation.find_by_id(conversation_id)
            if currConvo == None:
                return 0
            User.find_by_id(currConvo.user1).remove_conversation(conversation_id)
            User.find_by_id(currConvo.user2).remove_conversation(conversation_id)
            db = Connection.client[Connection.database]
            col = db[Conversation.collection]
            res = col.delete_one({ "_id": ObjectId(conversation_id) })
            if res.deleted_count == 0:
                return 0
            return 1
        except Exception as e:
            print (e)
            return 0

    @staticmethod
    def find(filters: dict):
        try: 
            db = Connection.client[Connection.database]
            col = db[Conversation.collection]
            res = col.find_one(filters)
            if res is None:
                return None
            return Conversation(
                convo_id=str(res["_id"]),
                user1=res["user1"],
                user2=res["user2"],
                messages=res["messages"]
            )
        except Exception as e:
            print (e)
            return None

    @staticmethod
    def find_by_participants(user1_id: str, user2_id: str):
        convo = Conversation.find({ "user1": user1_id, "user2": user2_id })
        if convo == None:
            convo = Conversation.find({ "user1": user2_id, "user2": user1_id })
        return convo

    @staticmethod
    def find_by_id(conversation_id: str):
        return Conversation.find({ "_id":  ObjectId(conversation_id) })
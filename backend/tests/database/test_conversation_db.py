import hashlib
from database.user import User
from database.post import Post
from database.conversation import Conversation
from runtests import mongodb
from utils.generate_random import generate_user
from database.topic import Topic

user1 = generate_user(good=True)
hashed_password = hashlib.md5(user1.password.encode()).hexdigest()
user1.password = hashed_password
user2 = generate_user(good=True)
hashed_password = hashlib.md5(user2.password.encode()).hexdigest()
user2.password = hashed_password

def test_create_users(mongodb):
    ret1= user1.push()
    ret2 = user2.push()
    assert ret1 is not None and ret2 is not None, "Failed to push users"

def test_create_convo(mongodb):
    ret, convo_id = Conversation.create(user1.user_id, user2.user_id)
    assert ret == 3 and convo_id is not None, "Failed to make the conversation"
    global good_convo_id 
    good_convo_id = convo_id

def test_create_dupe_convo(mongodb):
    ret, convo_id = Conversation.create(user1.user_id, user2.user_id)
    assert ret == 4 and convo_id is None, "Conversation was erroneously made"

def test_create_convo_invalid_user(mongodb):
    ret, convo_id = Conversation.create("55153a8014829a865bbf700d", user2.user_id)
    assert ret == 0 and convo_id is None, "Conversation was erroneously made"

def test_create_convo_invalid_user2(mongodb):
    ret, convo_id = Conversation.create(user1.user_id, "55153a8014829a865bbf700d")
    assert ret == 0 and convo_id is None, "Conversation was erroneously made"

def test_create_convo_invalid_user3(mongodb):
    ret, convo_id = Conversation.create("55153a8014829a865bbf700d", "55153a8014829a865bbf700d")
    assert ret == 0 and convo_id is None, "Conversation was erroneously made"

def test_create_convo_same_user(mongodb):
    ret, convo_id = Conversation.create(user1.user_id, user1.user_id)
    assert ret == 5 and convo_id is None, "Conversation was erroneously made"

def test_find_convo(mongodb):
    assert Conversation.find_by_id(good_convo_id) is not None, "Conversation was not found"

def test_find_convo_invalid_id(mongodb):
    assert Conversation.find_by_id("55153a8014829a865bbf700d") is None, "Conversation was erroneously found"

def test_find_convo_by_user(mongodb):
    assert Conversation.find_by_participants(user1.user_id, user2.user_id) is not None, "Conversation was not found"

def test_find_convo_by_user_invalid(mongodb):
    assert Conversation.find_by_participants(user1.user_id, "55153a8014829a865bbf700d") is None, "Conversation was erroneously found"

def test_find_convo_by_user_invalid2(mongodb):
    assert Conversation.find_by_participants("55153a8014829a865bbf700d", user2.user_id) is None, "Conversation was erroneously found"

def test_find_convo_by_user_invalid3(mongodb):
    assert Conversation.find_by_participants("55153a8014829a865bbf700d", "55153a8014829a865bbf700d") is None, "Conversation was erroneously found"

def test_add_message_no_restriction(mongodb):
    convo = Conversation.find_by_id(good_convo_id)
    ret = convo.add_message(user1.user_id, "testmessage")
    assert ret == 2 and Conversation.find_by_id(good_convo_id).messages[0]["message"] == "testmessage", "Message was not sent"

def test_add_message_restriction_following(mongodb):
    convo = Conversation.find_by_id(good_convo_id)
    user2.update_message_setting(True)
    user2.follow(user1.user_id)
    ret = convo.add_message(user1.user_id, "testmessage")
    assert ret == 2, "Message was not sent"

def test_delete_conversation(mongodb):
    ret = Conversation.delete(good_convo_id)
    assert good_convo_id not in user1.conversations and good_convo_id not in user2.conversations, "Conversation was not removed from the users"
    assert ret == 1 and Conversation.find_by_id(good_convo_id) is None, "Conversation was not deleted"

def test_delete_conversation_invalid(mongodb):
    ret = Conversation.delete("55153a8014829a865bbf700d")
    assert ret == 0, "Some conversation was erroneously deleted"
    



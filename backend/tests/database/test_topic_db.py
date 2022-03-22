import hashlib
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_good_topic, generate_topic, generate_user
from database.topic import Topic

good_user = generate_user(good=True)
good_topic = generate_topic(good=True)
post_id = generate_good_topic()

def test_push_topic(mongodb):
    assert good_topic.push() and Topic.find_by_name(good_topic.topic_name) is not None, "Push new topic failed"

def test_nonexisting_topic(mongodb):
    tmp_topic = generate_topic(True)
    assert Topic.find_by_name(tmp_topic.topic_name) is None, "Finding nonexistant topic failed"

def test_add_post_to_topic(mongodb):
    assert good_topic.add_post(post_id) and post_id in good_topic.posts, "Failed to add post"

def test_remove_post_from_topic(mongodb):
    assert good_topic.remove_post(post_id) and post_id not in good_topic.posts, "Failed to delete post"

def test_follow_topic(mongodb):
    if User.find_by_email(good_user.email) is None:
        good_user.push()
    assert good_user.follow_topic(good_topic.topic_name) and good_topic.topic_name in good_user.followed_topics, "Failed to follow topic"

def test_follow_topic_again(mongodb):
    if User.find_by_email(good_user.email) is None:
        good_user.push()
    assert good_user.follow_topic(good_topic.topic_name) and good_user.followed_topics.count(good_topic.topic_name) == 1, "Following already followed topic test failed"

def test_unfollow_topic(mongodb):
    assert good_user.unfollow_topic(good_topic.topic_name) and good_topic.topic_name not in good_user.followed_topics, "Failed to unfollow topic"

def test_unfollow_topic_again(mongodb):
        assert good_user.unfollow_topic(good_topic.topic_name) and good_topic.topic_name not in good_user.followed_topics, "Unfollow already unfollowed topic test failed"

def test_delete_topic(mongodb):
    Topic.delete(good_topic.topic_name)
    assert Topic.find_by_name(good_topic.topic_name) is None, "Topic was not deleted"
import hashlib
from database.user import User
from runtests import mongodb
from utils.generate_random import generate_good_topic, generate_topic, generate_user
from database.topic import Topic

good_user = generate_user(good=True)
bad_user = generate_user(good=False)
good_topic = generate_topic(good=True)
post_id = generate_good_topic()

def test_push_user(mongodb):
    hashed_password = hashlib.md5(good_user.password.encode()).hexdigest()
    good_user.password = hashed_password
    assert good_user.push(), "Push on user failed"

def test_find_user_with_valid_username(mongodb):
    assert User.find_by_username(good_user.username) == good_user, "Could not find user by username"

def test_find_user_with_invalid_username(mongodb):
    assert User.find_by_username(bad_user.username) is None, "Found nonexistent user by username"

def test_find_user_with_valid_email(mongodb):
    assert User.find_by_email(good_user.email) == good_user, "Could not find user by email"

def test_find_user_with_invalid_email(mongodb):
    assert User.find_by_email(bad_user.email) is None, "Found nonexistent user by email"

def test_find_user_by_credentials(mongodb):
    assert User.find_by_credentials(good_user.username, good_user.password) is not None, "Could not find user with credentials"

def test_update_user_username(mongodb):
    old_username = good_user.username
    new_user = generate_user(good=True)
    new_username = new_user.username
    good_user.update_username(new_username)
    assert good_user.username == new_username
    good_user.update_username(old_username)

def test_update_user_email(mongodb):
    old_email = good_user.email
    new_user = generate_user(good=True)
    new_email = new_user.email
    good_user.update_email(new_email)
    assert good_user.email == new_email
    good_user.update_email(old_email)

def test_update_user_password(mongodb):
    old_password = good_user.password
    new_user = generate_user(good=True)
    new_password = new_user.password
    good_user.update_password(new_password)
    assert good_user.password == new_password
    good_user.update_password(old_password)

def test_update_user_profile(mongodb):
    name = "xQcOw"
    bio = "CS Student | Gamer | Streamer | Chef | YouTuber"
    profile_img = "b64-encoded-img-of-minecraft"
    good_user.update_profile(name=name, bio=bio, profile_img=profile_img)
    assert good_user.name == name, "Name was not updated"
    assert good_user.bio == bio, "Bio was not updated"
    assert good_user.profile_img == profile_img, "Profile image was not updated"

def test_delete_user_by_username(mongodb):
    if User.find_by_username(good_user.username) is None:
        good_user.push()
    User.delete_by_username(good_user.username)
    assert User.find_by_username(good_user.username) is None, "User was not deleted"

def test_delete_user_by_email(mongodb):
    if User.find_by_email(good_user.email) is None:
        good_user.push()
    User.delete_by_email(good_user.email)
    assert User.find_by_email(good_user.email) is None, "User was not deleted"

def test_push_topic(mongodb):
    assert good_topic.push() and Topic.find_by_name(good_topic.name) is not None, "Push new topic failed"

def test_add_post_to_topic(mongodb):
    assert good_topic.add_post(post_id) and post_id in good_topic.posts, "Failed to add post"

def test_remove_post_from_topic(mongodb):
    assert good_topic.remove_post(post_id) and post_id not in good_topic.posts, "Failed to delete post"

def test_follow_topic(mongodb):
    if User.find_by_email(good_user.email) is None:
        good_user.push()
    assert good_user.follow_topic(good_topic.name) and good_topic.name in good_user.followed_topics, "Failed to follow topic"

def test_unfollow_topic(mongodb):
    assert good_user.unfollow_topic(good_topic.name) and good_topic.name not in good_user.followed_topics, "Failed to unfollow topic"

def test_delete_topic(mongodb):
    Topic.delete(good_topic.name)
    assert Topic.find_by_name(good_topic.name) is None, "Topic was not deleted"
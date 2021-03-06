import hashlib
from sys import stdout
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_user
from database.topic import Topic

good_user = generate_user(good=True)
bad_user = generate_user(good=False)

def test_push_user(mongodb):
    hashed_password = hashlib.md5(good_user.password.encode()).hexdigest()
    good_user.password = hashed_password
    assert good_user.push() is not None, "Push on user failed"

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

def test_save_post(mongodb):
    post = Post("post1", "topic1", good_user.user_id)
    if Post.find(post.post_id) is None:
        post.push()
    
    assert good_user.save_post(post.post_id), "Saving post failed"
    post = Post.find(post.post_id)
    assert post.post_id in good_user.saved_posts, "post_id not added to list of saved posts"
    assert good_user.user_id in post.saves, "user_id not added to list of users who saved the post"

    Post.delete(post.post_id)

def test_unsave_post(mongodb):
    post = Post("title", "topic", good_user.user_id)
    if Post.find(post.post_id) is None:
        post.push()

    assert good_user.save_post(post.post_id), "Saving post failed"
    post = Post.find(post.post_id)
    assert post.post_id in User.find_by_email(good_user.email).saved_posts, "post_id not added to list of saved posts"
    assert good_user.user_id in post.saves, "user_id not added to list of users who saved the post"

    assert good_user.unsave_post(post.post_id), "Unsaving post failed"
    post = Post.find(post.post_id)
    assert post.post_id not in User.find_by_email(good_user.email).saved_posts, "post not removed from saved posts"
    assert good_user.user_id not in post.saves, "user not removed from saves"
    
    Post.delete(post.post_id)

def test_delete_user_interaction(mongodb):
    user = generate_user(True)
    if User.find_by_email(user.email) is None:
        user.push()
    post = Post("title", "topic", user.user_id)
    if Post.find(post.post_id) is None:
        post.push()

    assert user.save_post(post.post_id), "failed to save post"
    post = Post.find(post.post_id)
    assert user.user_id in post.saves, "user_id not added to saves"

    User.delete_by_email(user.email), "failed to delete user"
    post = Post.find(post.post_id)
    assert user.user_id not in post.saves, "user_id not removed from saves"

    Post.delete(post.post_id)

def test_delete_post_interaction(mongodb):
    user = generate_user(True)
    if User.find_by_email(user.email) is None:
        user.push()
    post = Post("title", "topic", user.user_id)
    if Post.find(post.post_id) is None:
        post.push()

    assert user.save_post(post.post_id), "failed to save post"
    post = Post.find(post.post_id)
    assert user.user_id in post.saves, "user_id not added to saves"

    assert Post.delete(post.post_id) is None, "failed to delete post"
    user = User.find_by_email(user.email)
    assert post.post_id not in user.saved_posts, "post_id not removed from saves"

    User.delete_by_email(user.email)

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

def test_blocking_db(mongodb):
    user = generate_user(True)
    user_to_block = generate_user(True)

    if User.find_by_email(user.email) is None:
        user.push()
    if User.find_by_email(user_to_block.email) is None:
        user_to_block.push()

    try:
        ret = user.block(user_to_block.user_id)
        assert ret == 3, "Blocking failed"
        assert user_to_block.user_id in user.blocked and len(user.blocked) == 1, "User not added into blocked"
        assert user.unblock(user_to_block.user_id) == 3, "Unblocking failed"
        assert user_to_block.user_id not in user.blocked and len(user.blocked) == 0 and user.user_id not in user.blockedBy and len(user.blockedBy) == 0, "User not removed from blocked"

    finally:
        if User.delete_by_email(user.email) is not None:
            User.delete_by_email(user.email)
        if User.delete_by_email(user_to_block.email) is not None:
            User.delete_by_email(user_to_block.email)
   
def test_change_message_setting(mongodb):
    old_setting = good_user.onlyRecieveMsgFromFollowing
    good_user.update_message_setting(not old_setting)
    assert good_user.onlyRecieveMsgFromFollowing != old_setting
    good_user.update_message_setting(old_setting), "Message change was not made"

import hashlib
from tkinter import N
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_user

good_user = generate_user(good=True)
bad_user = generate_user(good=False)

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

def test_post(mongodb):
    # test post creation
    if User.find_by_username(good_user.email) is None:
        good_user.push()
    post = Post(title="My first post", topic="Games", username=good_user.username)
    post.push()
    assert post.post_id == Post.find(post.post_id).post_id, "Could not find post"
    assert post.post_id in User.find_by_username(good_user.username).posts, "Post was not added to the user"
    # test update likes
    likeCount = len(post.likes)
    post.like("emiru")
    post.like("emiru")
    post.like("tyler1")
    assert len(Post.find(post.post_id).likes) == likeCount + 2, "Likes was not updated correctly"
    # test add comment
    pair = ["xqcow1", "epic post dude! wow!"]
    post.add_comment(username=pair[0], comment=pair[1])
    assert pair in post.comments, "Comment was not added"
    # test post deletion
    Post.delete(post.post_id)
    assert Post.find(post.post_id) is None, "Post was not deleted"
    User.delete_by_username(good_user.username)

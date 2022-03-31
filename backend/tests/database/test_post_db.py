import hashlib
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_user
from database.topic import Topic

def test_post(mongodb):
    user = generate_user(True)
    user2 = generate_user(True)     # Delete post first
    user3 = generate_user(True)     # Delete user first
    if User.find_by_username(user.username) is None:
        user.push()
    if User.find_by_username(user2.username) is None:
        user2.push()
    if User.find_by_username(user3.username) is None:
        user3.push()

    # test post creation
    post = Post(title="My first post", topic="Games", author_id=user.user_id)
    post2 = Post(title="second post", topic="Games", author_id=user2.user_id)
    post3 = Post(title="third post", topic="Games", author_id=user3.user_id)
    post.push()
    post2.push()
    post3.push()
    assert Post.find(post.post_id).post_id is not None, "Could not find post"
    assert post.post_id in User.find_by_username(user.username).posts, "Post was not added to the user"

    # test like post
    post.like(user.user_id)
    post2.like(user2.user_id)
    post3.like(user3.user_id)
    assert len(Post.find(post.post_id).likes) == 1, "Likes not updated correctly"
    assert user.user_id in Post.find(post.post_id).likes, "user_id not added to list of users who liked"
    assert post.post_id in User.find_by_username(user.username).liked_posts, "post_id not added to user's list of liked posts"

    # test unlike post
    post.unlike(user.user_id)
    assert len(Post.find(post.post_id).likes) == 0, "Likes not updated correctly"
    assert user.user_id not in Post.find(post.post_id).likes, "user_id not removed from list of users who liked"
    assert post.post_id not in User.find_by_username(user.username).liked_posts, "post_id not removed from user's list of liked posts"

    # test add comment
    pair = [{"user_id": user.user_id}, {"comment": "epic post dude! wow!"}]
    post.add_comment(pair[0]["user_id"], pair[1]["comment"])
    post2.add_comment(user2.user_id, "comment2")
    post3.add_comment(user3.user_id, "comment3")
    user = User.find_by_email(user.email)
    assert pair in post.comments, "Comment was not added"
    assert post.post_id in user.comments, "post_id not added to user's list of comments"

    # test post deletion
    Post.delete(post.post_id)
    assert Post.find(post.post_id) is None, "Post was not deleted"
    User.delete_by_username(user.username)

    # test that deleting post removes interactions from user
    Post.delete(post2.post_id)
    user2 = User.find_by_username(user2.username)
    assert post2.post_id not in user2.liked_posts, "post_id not removed from user's list of liked posts"
    assert post2.post_id not in user2.comments, "post_id not removed from user's list of comments"

    # test that deleting user removes interactions from post
    user3 = User.find_by_username(user3.username)
    User.delete_by_username(user3.username)
    post3 = Post.find(post3.post_id)
    assert user3.user_id not in post3.likes and len(post3.likes) == 0, "user_id not removed from post's likes after deleting user"
    assert [{"user_id": user3.user_id}, {"comment": "comment3"}] not in post3.comments, "comment not removed from post after deleting user"

    Post.delete(post3.post_id)
    User.delete_by_username(user2.username)
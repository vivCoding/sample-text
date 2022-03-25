import hashlib
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_user
from database.topic import Topic

def test_post(mongodb):
    user = generate_user(True)
    if User.find_by_username(user.username) is None:
        user.push()

    # test post creation
    post = Post(title="My first post", topic="Games", author_id=user.user_id)
    post.push() 
    assert Post.find(post.post_id).post_id is not None, "Could not find post"
    assert post.post_id in User.find_by_username(user.username).posts, "Post was not added to the user"

    # test like post
    post.like(user.user_id)
    assert len(Post.find(post.post_id).likes) == 1, "Likes not updated correctly"
    assert user.user_id in Post.find(post.post_id).likes, "user_id not added to list of users who liked"

    # test unlike post
    post.unlike(user.user_id)
    assert len(Post.find(post.post_id).likes) == 0, "Likes not updated correctly"
    assert user.user_id not in Post.find(post.post_id).likes, "user_id not removed from list of users who liked"

    # test add comment
    pair = ["xqcow1", "epic post dude! wow!"]
    post.add_comment(user_id=pair[0], comment=pair[1])
    assert pair in post.comments, "Comment was not added"
    # test post deletion
    Post.delete(post.post_id)
    assert Post.find(post.post_id) is None, "Post was not deleted"
    User.delete_by_username(user.username)
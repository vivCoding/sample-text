import hashlib
from database.user import User
from database.post import Post
from runtests import mongodb
from utils.generate_random import generate_user
from database.topic import Topic

def test_post(mongodb):
    user = generate_user(good=True)
    if User.find_by_username(user.email) is None:
        user.push()
    # test post creation
    post = Post(title="My first post", topic="Games", author_id=user.user_id)
    post.push()
    assert post.post_id == Post.find(post.post_id).post_id, "Could not find post"
    assert post.post_id in User.find_by_username(user.username).posts, "Post was not added to the user"
    # test update likes
    likeCount = len(post.likes)
    post.like("emiru")
    post.like("emiru")
    post.like("tyler1")
    assert len(Post.find(post.post_id).likes) == likeCount + 2, "Likes was not updated correctly"
    # test add comment
    pair = ["xqcow1", "epic post dude! wow!"]
    post.add_comment(user_id=pair[0], comment=pair[1])
    assert pair in post.comments, "Comment was not added"
    # test post deletion111
    Post.delete(post.post_id)
    assert Post.find(post.post_id) is None, "Post was not deleted"
    User.delete_by_username(user.username)
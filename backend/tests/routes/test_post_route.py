from flask import session
from runtests import test_client
from database.user import User
from database.post import Post
from utils.generate_random import generate_user

def test_post_creation(test_client):
    try:
        user = generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
            })
        data = response.json
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"User creation test failed for: {str(user.to_dict())}, error: {data.get('error', None)}"
        assert user.username == session.get("username", None), "User session not added for: " + user.username

        post = Post(title="My second post", topic="Games", username="esl-csgo")
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "username": post.username,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        print(str(post.to_dict()))
        print(data)
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        post.post_id = data['data']['post_id']
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()


def test_post_deletion(test_client):
    try:
        # simulate logged in user
        user = generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        # user creates a post
        post = Post(title="My second post", topic="Games", username="esl-csgo")
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "username": post.username,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        post.post_id = data['data']['post_id']
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"
        # user deletes a post
        response = test_client.post("/api/post/deletepost", json={
            "post_id": post.post_id
            })
        data = response.json
        assert response.status_code == 200, "Deletion response with status " + str(response.status_code)
        assert data["success"] == True, f"Delete post test failed for user {post.post_id}, got success {data.get('success', None)} and error {data.get('error', None)}"
        deleted_post = Post.find(post.post_id)
        assert deleted_post is None, f"Post deletion failed for {post.post_id}, still in database!"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()


def test_like_post(test_client):
    try:
        # simulate logged in user
        user = generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        # user creates a post
        post = Post(title="My second post", topic="Games", username="esl-csgo")
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "username": post.username,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        post.post_id = data['data']['post_id']
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"
        # track initial number of likes on this post
        likeCount = len(post.likes)
        # user likes this post
        response = test_client.post("/api/post/likepost", json={
            "post_id": post.post_id
            })
        data = response.json
        assert response.status_code == 200, "Like response with status " + str(response.status_code)
        assert data["success"] == True, f"Like post test failed for post {post.post_id}, got success {data.get('success', None)} and error {data.get('error', None)}"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()


def test_comment_on_post(test_client):
    # simulate logged in user
    user = generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
        "username": user.username,
        "email": user.email,
        "password": user.password,
    })
    assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
    # user creates a post
    post = Post(title="My second post", topic="Games", username="esl-csgo")
    response = test_client.post("/api/post/createpost", json={
        "title": post.title,
        "topic": post.topic,
        "username": post.username,
        "img": post.img,
        "caption": post.caption,
        "anonymous": post.anonymous,
        "likes": post.likes,
        "comments": post.comments,
        "date": post.date,
        "post_id": post.post_id
        })
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    data = response.json
    post.post_id = data['data']['post_id']
    assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
    assert Post.find(post.post_id) is not None, "Post was not found in database"
    # valid comment on a post
    comment = "This is a valid comment"
    response = test_client.post("/api/post/commentonpost", json={
        "post_id": post.post_id,
        "comment": comment
        })
    data = response.json
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == True, f"Comment on post test failed for: {comment}, error: {data.get('errorMessage', None)}"
    assert [user.username, comment] in data["data"]["comments"], "Comment was not added correctly"
    # invalid comment on a post
    comment = ""
    response = test_client.post("/api/post/commentonpost", json={
        "post_id": post.post_id,
        "comment": comment
        })
    data = response.json
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False, f"Comment on post test succeeded for: {comment}, error: {data.get('errorMessage', None)}"
    test_client.cookie_jar.clear()

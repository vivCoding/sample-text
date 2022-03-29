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
        assert session.get("user_id", None) is not None, "User session not added for: " + user.username

        post = Post(title="My second post", topic="games", author_id=data["data"]["userId"])
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
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
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        if "user_id" in session:
            session.pop("user_id")
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
        data = response.json
        post = Post(title="My second post", topic="games", author_id=data["data"]["userId"])
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
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
        response = test_client.post("/api/post/deletepost", json={ "post_id": post.post_id })
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
        data = response.json
        userId = data["data"]["userId"]
        post = Post(title="My second post", topic="games", author_id=userId)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad create post response, got " + str(response.status_code)
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
        assert response.status_code == 200, "Bad like post response, got " + str(response.status_code)
        post = Post.find(post.post_id)
        user = User.find_by_email(user.email)
        assert data["success"] == True and len(post.likes) == likeCount + 1 and userId in post.likes and post.post_id in user.liked_posts, f"Like post test failed for post {post.post_id}, got success {data.get('success', None)} and error {data.get('error', None)}"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()

def test_unlike_post(test_client):
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
        data = response.json
        userId = data["data"]["userId"]
        post = Post(title="My second post", topic="games", author_id=userId)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad create post response, got " + str(response.status_code)
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
        assert response.status_code == 200, "Bad like post response, got " + str(response.status_code)
        post = Post.find(post.post_id)
        user = User.find_by_email(user.email)
        assert data["success"] == True and len(post.likes) == likeCount + 1 and userId in post.likes and post.post_id in user.liked_posts, f"Like post test failed for post {post.post_id}, got success {data.get('success', None)} and error {data.get('error', None)}"
    
        # track initial number of likes
        likeCount = len(post.likes)
        # user unlikes the post
        response = test_client.post("/api/post/unlikepost", json={
            "post_id": post.post_id
        })
        data = response.json
        assert response.status_code == 200, "Bad unlike post response, got " + str(response.status_code)
        post = Post.find(post.post_id)
        user = User.find_by_email(user.email)
        assert data["success"] == True and len(post.likes) == likeCount - 1 and userId not in post.likes and post.post_id not in user.liked_posts, f"Unlike post test failed for post {post.post_id}, got success {data.get('success', None)} and error {data.get('error', None)}"
    
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()

def test_comment_on_post(test_client):
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
        user_data = response.json
        post = Post(title="My second post", topic="games", author_id=user_data["data"]["userId"])
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
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
        assert [{"user_id": user_data["data"]["userId"]}, {"comment": comment}] in data["data"]["comments"], "Comment was not added correctly"
        assert post.post_id in User.find_by_email(user.email).comments, "post_id not added to user's list of comments"

        # invalid comment on a post
        comment = ""
        response = test_client.post("/api/post/commentonpost", json={
            "post_id": post.post_id,
            "comment": comment
            })
        data = response.json
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == False, f"Comment on post test succeeded for: {comment}, error: {data.get('errorMessage', None)}"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()

def test_anon_post(test_client):
    try:
        # generate main user
        user1 = generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password
            })
        data = response.json
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"User creation test failed for: {str(user1.to_dict())}, error: {data.get('error', None)}"
        assert session.get("user_id", None) is not None, "User session not added for: " + user1.username
        user1.user_id = session.get("user_id", None)
        # generate second user
        user2 = generate_user(True)
        user2.push()
        # user2 creates an anon post
        post = Post("Check out my post", "Board Games", user2.user_id, anonymous=True)
        post.push()
        user1.add_post(post.post_id)
        assert post.post_id in user2.posts, "Post was not added to user2"
        # anon post by user2 should NOT appear when user1 views user2's profile
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user2.user_id
            })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        posts = data['data']['posts']
        assert post.post_id not in posts, "anon post appears in another user's profile"
        # getting an anon post should not include the author id
        response = test_client.post("/api/post/getpost", json={
            "post_id": post.post_id
            })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        fetchedPost = data['data']
        assert "author_id" not in fetchedPost, "author_id in an anon post"
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear() 
        
def test_save_post(test_client):
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
        user_data = response.json
        post = Post(title="title", topic="topic", author_id=user_data["data"]["userId"])
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
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

        response = test_client.post("/api/post/savepost", json={
            "post_id": post.post_id
        })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        assert data["success"] == True, f"Saving post test failed for: {str(post.to_dict())}"

        user = User.find_by_email(user.email)
        post = Post.find(post.post_id)

        assert post.post_id in user.saved_posts, "Saved post not added correctly"
        assert user.user_id in post.saves, "user_id not added correctly"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()

def test_unsave_post(test_client):
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
        user_data = response.json
        post = Post(title="title", topic="topic", author_id=user_data["data"]["userId"])
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": post.author_id,
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

        response = test_client.post("/api/post/savepost", json={
            "post_id": post.post_id
        })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        assert data["success"] == True, f"Saving post test failed for: {str(post.to_dict())}"

        user = User.find_by_email(user.email)
        post = Post.find(post.post_id)

        assert post.post_id in user.saved_posts, "Saved post not added correctly"
        assert user.user_id in post.saves, "user_id not added correctly"

        response = test_client.post("/api/post/unsavepost", json={
            "post_id": post.post_id
        })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        assert data["success"] == True, f"Unaving post test failed for: {str(post.to_dict())}"

        user = User.find_by_email(user.email)
        post = Post.find(post.post_id)

        assert post.post_id not in user.saved_posts, "Saved post not removed correctly"
        assert user.user_id not in post.saves, "user_id not removed correctly"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        test_client.cookie_jar.clear()

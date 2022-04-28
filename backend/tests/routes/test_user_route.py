from flask import session
from database.post import Post
from runtests import test_client
from database.user import User
from utils import generate_random
from utils.encrypt import encrypt

def test_user_creation(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
            })
        data = response.json

        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"User creation test failed for: {str(user.to_dict())}, error: {data.get('error', None)}"
        assert session.get("user_id", None) is not None, "User session not added for: " + user.username
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        test_client.cookie_jar.clear()
    

def test_bad_email(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": f"{user.username}atgmail.com",
            "password": user.password
        })
    
    data = response.json
    if User.find_by_email(user.email):
        User.delete_by_email(user.email)
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and (data["error"] == 3), f"Bad Email Assertion failed for: {user.username}, {user.email}, got success {data.get('success', None)} and error {data.get('error', None)}"
    test_client.cookie_jar.clear()


def test_create_bad_password(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": "123456789101112131415161718"
        })
    data = response.json
    if User.find_by_email(user.email):
        User.delete_by_email(user.email)
    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and (data["error"] == 4), f"Bad Password Assertion Failed for: {user.password}, got success {data.get('success', None)} and error {data.get('error', None)}"
    test_client.cookie_jar.clear()


def test_login_nonexisting_username(test_client):
    user = generate_random.generate_user(True)
    response = test_client.post("/api/user/login", json={
        "loginField": user.username,
        "password": user.password
    })
    data = response.json

    assert response.status_code == 200, "Bad response, got " + str(response.status_code)
    assert data["success"] == False and data["error"] == 1, f"Login nonexisting user failed for {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
    
    test_client.cookie_jar.clear()


def test_login_wrong_password(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
        })

        assert response.status_code == 200, "Bad create account response, got " + str(response.status_code)
        test_client.cookie_jar.clear()

        response = test_client.post("/api/user/login", json={
            "loginField": user.username,
            "password": "wrong"
        })
        data = response.json

        assert response.status_code == 200, "Bad login account response, got " + str(response.status_code)
        assert data["success"] == False and data["error"] == 1, f"Login wrong password failed for {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()


def test_login_existing(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
        })

        assert response.status_code == 200, "Bad create account response, got " + str(response.status_code)
        test_client.cookie_jar.clear()

        response = test_client.post("/api/user/login", json={
            "loginField": user.username,
            "password": user.password
        })
        data = response.json

        assert response.status_code == 200, "Bad login account response, got " + str(response.status_code)
        assert data["success"] == True, f"Login to existing user test failed for {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
        assert session.get("user_id", None) is not None, "User session not added for: " + user.username
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        test_client.cookie_jar.clear()


def test_delete_account(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)

        response = test_client.post("/api/user/deleteuser", json={
            "password": user.password
        })
        data = response.json
        
        assert response.status_code == 200, "Deletion response with status " + str(response.status_code)
        assert data["success"] == True, f"Delete user test failed for user {user.username}, got success {data.get('success', None)} and error {data.get('error', None)}"
        deleted_user = User.find_by_email(user.email)
        assert deleted_user is None, f"User deletion failed for {user.username}, still in database!"
    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        test_client.cookie_jar.clear()

def test_edit_account_username(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Bad response for create account " + str(response.status_code)
        
        new_username = generate_random.generate_user(True).username

        response = test_client.post("/api/user/editusername", json={
            "newUsername": new_username,
        })

        data = response.json
        dbuser = User.find_by_username(new_username)
        
        assert response.status_code == 200, "Bad response for edit username " + str(response.status_code)
        assert data["success"] == True, f"Updating username test failed for {user.username} -> {new_username}, got success {data.get('success', None)} and error {data.get('error', None)}"
        assert dbuser is not None, f"Mismatch in db and new user for {user.username} -> {new_username}"

    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        test_client.cookie_jar.clear()

def test_edit_account_password(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Bad response for create account " + str(response.status_code)
        
        new_user_pass = generate_random.generate_user(True).password
        response = test_client.post("/api/user/editpassword", json={
            "newPassword": new_user_pass,
            "oldPassword": user.password
        })

        data = response.json
        dbuser = User.find_by_username(user.username)
        
        assert response.status_code == 200, "Bad response for edit password " + str(response.status_code)
        assert data["success"] == True, f"Updating password test failed for {user.password} -> {new_user_pass}, got success {data.get('success', None)} and error {data.get('error', None)}"
        assert dbuser is not None and dbuser.password == encrypt(new_user_pass), f"Mismatch in db and new passowrd"

    finally:
        if User.find_by_email(user.email):
            User.delete_by_email(user.email)
        test_client.cookie_jar.clear()
        

def test_edit_account_email(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Bad response for create account " + str(response.status_code)
        
        new_user_email = generate_random.generate_user(True).email

        response = test_client.post("/api/user/editemail", json={
            "newEmail" : new_user_email,
        })

        data = response.json
        dbuser = User.find_by_email(new_user_email)

        assert response.status_code == 200, "Bad response for edit email " + str(response.status_code)
        assert data["success"] == True, f"Updating email test failed for {user.email} -> {new_user_email}, got success {data.get('success', None)} and error {data.get('error', None)}"
        assert dbuser is not None, f"Database info mismatch for {user.email} -> {new_user_email}"

    finally:
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        test_client.cookie_jar.clear()

def test_edit_profile(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })

        assert response.status_code == 200, "Bad response for creating account " + str(response.status_code)

        response = test_client.post("/api/user/editprofile", json={
            "name": "Aldiyar",
            "bio": "cool guy",
            "profile_img": "12345678"
        })
        data = response.json
        
        assert response.status_code == 200, "Bad response for editing profile " + str(response.status_code)
        assert data["success"] == True, f"Updating user profile test failed, got success {data.get('success', None)} and error {data.get('error', None)}"

        new_user = User.find_by_username(user.username)
        assert new_user is not None, "User does not exist"
        assert new_user.name == "Aldiyar" and new_user.bio == "cool guy" and new_user.profile_img == "12345678", "Mismatch between db!"
    finally:
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()

def test_post_creation(test_client):
    try:
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password
            })
        data = response.json
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"User creation test failed for: {str(user.to_dict())}, error: {data.get('error', None)}"
        assert User.find_by_email(user.email).user_id == session.get("user_id", None), "User session not added for: " + user.username

        post = Post(title="My second post", topic="games", author_id=User.find_by_email(user.email).user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": User.find_by_email(user.email).user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
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
    post = None
    try:
        # simulate logged in user
        user = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        # user creates a post
        post = Post(title="My second post", topic="games", author_id=User.find_by_email(user.email).user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": User.find_by_email(user.email).user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
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
        if post is not None and Post.find(post.post_id):
            Post.delete(post.post_id)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()

def test_logged_in_getprofile(test_client):
    try:
        # create first user
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)

        # user creates a post
        post = Post(title="title", topic="topic", author_id=user1.user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": user1.user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"

        # logout of first user
        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"

        # create second user
        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"
        user2 = User.find_by_email(user2.email)

        # view first user's profile while logged into second user
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })
        data = response.json
        assert response.status_code == 200, "Bad getprofile response " + str(response.status_code)
        assert data["success"] == True, f"getprofile failed, got success {data.get('success', None)}"
        assert data["data"]["username"] == user1.username, f"Returned username is incorrect, got {data['data'].get('username', None)}"
        assert post.post_id in data["data"]["posts"], "User's posts not returned"
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()
def test_not_logged_in_getprofile(test_client):
    try:
        # create first user
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)

        # user creates a post
        post = Post(title="title", topic="topic", author_id=user1.user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": user1.user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"

        # logout of first user
        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"

        # view first user's profile while not logged in
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })

        data = response.json
        assert response.status_code == 200, "Bad getprofile response " + str(response.status_code)
        assert data["success"] == True, f"getprofile failed, got success {data.get('success', None)}"
        assert data["data"]["username"] == user1.username, f"Returned username is incorrect, got {data['data'].get('username', None)}"
        assert "posts" not in data["data"], "list of posts still returned"
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if Post.find(post.post_id):
            Post.delete(post.post_id)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()

def test_blocked_get_profile(test_client):
    try:
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)

        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"

        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"

        user2 = User.find_by_email(user2.email)
        
        user1.block(user2.user_id)

        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })
        assert response.status_code == 404, "Worked out, however user is blocked"

    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        test_client.cookie_jar.clear()

def test_blockedBy_get_profile(test_client):
    try:
        #creating user1
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)
        #logging out
        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"
        #creating user2
        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"

        user2 = User.find_by_email(user2.email)
        #blocking beforehand
        user2.block(user1.user_id)
        #getting profile
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })
        assert response.status_code == 200, "Did not work out, however user is not blocked"

    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        test_client.cookie_jar.clear()

def test_blocked_get_profile(test_client):
    try:
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)

        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"

        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"

        user2 = User.find_by_email(user2.email)
        
        user1.block(user2.user_id)

        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })
        assert response.status_code == 404, "Worked out, however user is blocked"

    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        test_client.cookie_jar.clear()

def test_blocked_get_post(test_client):
    try:
        #creating user1
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)
        # user creates a post
        post = Post(title="title", topic="topic", author_id=user1.user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": user1.user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"

        #logging out
        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"
        #creating user2
        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"

        user2 = User.find_by_email(user2.email)
        #blocking beforehand
        user1.block(user2.user_id)

        #getting post
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })

        assert response.status_code == 404, "Good get profile response " + str(response.status_code)
        
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        test_client.cookie_jar.clear()

def test_not_blocked_get_post(test_client):
    try:
        #creating user1
        user1 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user1.username,
            "email": user1.email,
            "password": user1.password,
        })
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        user1 = User.find_by_email(user1.email)
        # user creates a post
        post = Post(title="title", topic="topic", author_id=user1.user_id)
        response = test_client.post("/api/post/createpost", json={
            "title": post.title,
            "topic": post.topic,
            "author_id": user1.user_id,
            "img": post.img,
            "caption": post.caption,
            "anonymous": post.anonymous,
            "likes": post.likes,
            "comments": post.comments,
            "date": post.date,
            "post_id": post.post_id
            })
        data = response.json
        post.post_id = data['data']['post_id']
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"Post creation test failed for: {str(post.to_dict())}, error: {data.get('error', None)}"
        assert Post.find(post.post_id) is not None, "Post was not found in database"

        #logging out
        response = test_client.post("/api/user/logout", json={})
        data = response.json
        assert response.status_code == 200, "Bad response logging out, got " + str(response.status_code)
        assert data["success"] == True, f"Logging out failed, got success {data.get('success', None)}"
        #creating user2
        user2 = generate_random.generate_user(True)
        response = test_client.post("/api/user/createaccount", json={
            "username": user2.username,
            "email": user2.email,
            "password": user2.password,
        })
        data = response.json
        assert response.status_code == 200, "Bad create account reponse " + str(response.status_code)
        assert data["success"] == True, f"User creation failed, got success {data.get('success', None)}"

        user2 = User.find_by_email(user2.email)
        #blocking beforehand
        user2.block(user1.user_id)
        #getting post
        response = test_client.post("/api/user/getprofile", json={
            "username_or_id": user1.username
        })

        assert data.get("posts", None) != [], "list of posts did not return"
        
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        test_client.cookie_jar.clear()
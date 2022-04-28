import tempfile
from time import time
from flask import session
from runtests import test_client
from database.user import User
from database.post import Post
from database.topic import Topic
from utils.generate_random import generate_user, generate_good_topic
from datetime import datetime

def test_generate_userline(test_client):
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
        # second user creates a post
        generated_topic = generate_good_topic()
        post1 = Post("Check out my post", generated_topic, user2.user_id)
        post1.push()
        parent_topic = Topic.find_by_name(post1.topic)
        if parent_topic is None:
            parent_topic = Topic(post1.topic, [post1.post_id])
            parent_topic.push()
        else:
            parent_topic.add_post(post1.post_id)
        user2.add_post(post1.post_id)
        # second user creates another post
        generated_topic = generate_good_topic()
        post2 = Post("Check out my second post", generated_topic, user2.user_id)
        post2.push()
        parent_topic = Topic.find_by_name(post2.topic)
        if parent_topic is None:
            parent_topic = Topic(post2.topic, [post2.post_id])
            parent_topic.push()
        else:
            parent_topic.add_post(post2.post_id)
        user2.add_post(post2.post_id)
        # user1 likes the post
        post1.like(user1.user_id)
        post2.like(user1.user_id)
        # user1 comments on the post
        post1.add_comment(user1.user_id, "Cool post man!")
        # user1 saves the post
        user1.save_post(post1.post_id)
        # user1 dislikes the post
        post1.dislike(user1.user_id)
        # user1 loves the post
        post1.love(user1.user_id)
        # generate userline
        response = test_client.post("/api/userline/generateuserline", json={ "user_id": user1.user_id })
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        userline = data['data']
        print("userline: ", userline)
        # assert that all post interactions are in the userline
        assert [post1.post_id, "Liked", post1.date] in userline, "post1 like was not in user1's userline"
        assert [post2.post_id, "Liked", post2.date] in userline, "post2 like was not in user1's userline"
        assert [post1.post_id, "Commented", post1.date] in userline, "post1 comment was not in user1's userline"
        assert [post1.post_id, "Saved", post1.date] in userline, "post1 save was not in user1's userline"
        assert [post1.post_id, "Disliked", post1.date] in userline, "post1 dislike was not in user1's userline"
        assert [post1.post_id, "Loved", post1.date] in userline, "post1 love was not in user1's userline"
        # assert that posts are sorted by creation time
        sortedUserline = sorted(userline, key = lambda x:datetime.strptime(x[2], '%Y/%m/%d, %H:%M:%S'), reverse=True)
        assert userline == sortedUserline, "userline is not sorted correctly"
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        if Post.find(post1.post_id):
           Post.delete(post1.post_id)
        if Post.find(post2.post_id):
           Post.delete(post2.post_id)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()

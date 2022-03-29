import tempfile
from time import time
from flask import session
from runtests import test_client
from database.user import User
from database.post import Post
from database.topic import Topic
from utils.generate_random import generate_user, generate_good_topic
from datetime import datetime

def test_generate_timeline(test_client):
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
        assert post1.post_id in user2.posts, "Post was not added to user2"
        # user1 follows user2
        user1.follow(user2.user_id)
        assert user2.user_id in user1.following, "user1 is not following user2" 
        # generate third user
        user3 = generate_user(True)
        user3.push()
        # third user creates a post
        post2 = Post("This is a cool topic to post to", generated_topic, user3.user_id)
        post2.push()
        parent_topic = Topic.find_by_name(post2.topic)
        if parent_topic is None:
            parent_topic = Topic(post2.topic, [post2.post_id])
            parent_topic.push()
        else:
            parent_topic.add_post(post2.post_id)
        user3.add_post(post2.post_id)
        assert post2.post_id in user3.posts, "Post was not added to user3"
        # user1 follows the topic user3 posted to
        user1.follow_topic(generated_topic)
        assert generated_topic in user1.followed_topics
        # generate timeline
        response = test_client.post("/api/timeline/generatetimeline")
        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        data = response.json
        timeline = data['data']
        print("timeline: ", timeline)
        assert post1.post_id in timeline, "post1 was not in user1's timeline --> followed user error"
        assert post2.post_id in timeline, "post2 was not in user1's timeline --> followed topic error"
        # assert that posts are sorted by creation time
        sortedTimeline = sorted(timeline, key=lambda post_id: datetime.strptime(Post.find(post_id).date, '%Y/%m/%d, %H:%M:%S'))
        assert sortedTimeline == timeline, "Timeline is not sorted by creation time"
    finally:
        if User.find_by_email(user1.email):
            User.delete_by_email(user1.email)
        if User.find_by_email(user2.email):
            User.delete_by_email(user2.email)
        if User.find_by_email(user3.email):
            User.delete_by_email(user3.email)
        if "user_id" in session:
            session.pop("user_id")
        test_client.cookie_jar.clear()

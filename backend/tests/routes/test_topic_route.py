import json
from flask import session
from runtests import test_client
from database.user import User
from database.post import Post
from database.topic import Topic
from utils.generate_random import generate_user, generate_topic

def test_bad_topic_creation(test_client):
    try:
        user = generate_user(True)
        response = test_client.post('api/user/createaccount', json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad response for account creation " + str(response.status_code)

        topic = generate_topic(False)
        response = test_client.post("/api/topic/createtopic", json={
            "topic_name": topic.topic_name,
            "posts": topic.posts
        })
        data = response.json

        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == False, "Bad topic test failed"
    finally:
        if Topic.find_by_name(topic.topic_name):
            Topic.delete(topic.topic_name)
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()

def test_good_topic_creation(test_client):
    try:
        user = generate_user(True)
        response = test_client.post('api/user/createaccount', json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad response for account creation " + str(response.status_code)

        topic = generate_topic(True)
        response = test_client.post("/api/topic/createtopic", json={
                "topic_name": topic.topic_name,
                "posts": topic.posts
            })
        data = response.json

        assert response.status_code == 200, "Bad response, got " + str(response.status_code)
        assert data["success"] == True, f"Topic creation test failed for: {str(topic.to_dict())}, error: {data.get('error', None)}"
    finally:
        if Topic.find_by_name(topic.topic_name):
            Topic.delete(topic.topic_name)
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        test_client.cookie_jar.clear()


def test_find_topic(test_client):
    try:
        user = generate_user(True)
        response = test_client.post('api/user/createaccount', json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad response for account creation " + str(response.status_code)

        topic = generate_topic(True)
        response = test_client.post("/api/topic/createtopic", json={
            "topic_name": topic.topic_name,
            "posts": topic.posts
        })

        assert response.status_code == 200, "Bad create topic response, got " + str(response.status_code)

        response = test_client.post("/api/topic/findtopic", json={
            "topic_name": topic.topic_name
        })
        data = response.json

        assert response.status_code == 200, "Bad finding topic response, got " + str(response.status_code)
        assert data["success"] == True, f"Finding existing topic failed for {topic.name}, got success {data.get('success', None)} and error {data.get('error', None)}"
    finally:
        if Topic.find_by_name(topic.topic_name):
            Topic.delete(topic.topic_name)
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        test_client.cookie_jar.clear()

def test_topic_follow(test_client):
    try:
        user = generate_user(True)
        response = test_client.post('api/user/createaccount', json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad response for account creation " + str(response.status_code)

        topic = generate_topic(True)
        response = test_client.post('/api/topic/createtopic', json={
            "topic_name": topic.topic_name,
            "posts": topic.posts,
        })

        assert response.status_code == 200, "Bad response for topic creation " + str(response.status_code)

        response = test_client.post('/api/user/followtopic', json={
            "topic_name": topic.topic_name
        })
        data = response.json

        assert response.status_code == 200, "Bad response for following a topic " + str(response.status_code)
        assert data["success"], f"Following topic test failed, got success {data.get('success', None)}"

        assert topic.topic_name in user.followed_topics, "Mismatch between db!"
    finally:
        if Topic.find_by_name(topic.topic_name):
            Topic.delete(topic.topic_name)
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()

def test_topic_unfollow(test_client):
    try:
        user = generate_user(True)
        response = test_client.post('api/user/createaccount', json={
            "username": user.username,
            "email": user.email,
            "password": user.password,
        })
        assert response.status_code == 200, "Bad response for account creation " + str(response.status_code)

        topic = generate_topic(True)
        response = test_client.post('/api/topic/createtopic', json={
            "topic_name": topic.topic_name,
            "posts": topic.posts,
        })

        assert response.status_code == 200, "Bad response for topic creation " + str(response.status_code)

        response = test_client.post('/api/user/followtopic', json={
            "topic_name": topic.topic_name
        })
        data = response.json

        assert response.status_code == 200, "Bad response for following a topic " + str(response.status_code)
        assert data["success"], f"Following topic test failed, got success {data.get('success', None)}"

        assert topic.topic_name in user.followed_topics, "Mismatch between db!"

        response = test_client.post('api/user/unfollowtopic', json={
            "topic_name": topic.topic_name
        })
        data = response.json

        assert response.status_code == 200, "Bad response for unfollowing a topic " + str(response.status_code)
        assert data["success"], f"Unfollowing topic test failed, got success {data.get('success', None)}"

        assert topic.topic_name not in user.followed_topics, "Mismatch between db!"
    finally:
        if Topic.find_by_name(topic.topic_name):
            Topic.delete(topic.topic_name)
        if User.find_by_username(user.username):
            User.delete_by_username(user.username)
        if "username" in session:
            session.pop("username")
        test_client.cookie_jar.clear()
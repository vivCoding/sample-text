from flask import Blueprint, jsonify, request, session
from itsdangerous import json
from database.topic import Topic

topic_blueprint = Blueprint("topic", __name__)

@topic_blueprint.route('/createtopic', methods=["POST"])
def create_topic():
    try:
        data = request.get_json()
        new_topic = Topic(data["name"], data["posts"])
        new_topic.push()
        return jsonify({ "success": True, "data": new_topic.to_dict() }), 200
    except Exception as e:
        print(e)
        return jsonify({ "success": False }), 500

@topic_blueprint.route('/findtopic', methods=["POST"])
def find_topic():
    try:
        data = request.get_json()
        name = data["name"]
        topic = Topic.find_by_name(name)
        if topic is not None:
            return jsonify({ "success": True, "data": topic.to_dict() }), 200
        else:
            return jsonify({ "success": False }), 404
    except Exception as e:
        print(e)
        return jsonify({ "success": False, "error": -1 }), 500

@topic_blueprint.route('/addpost', methods=["POST"])
def add_post():
    try:
        data = request.get_json()
        name = data["name"]
        post_id = data["post_id"]
        topic = Topic.find_by_name(name)
        if topic is not None:
            topic.add_post(post_id)
            return jsonify({ "success": True }), 200
        else:
            return jsonify({ "success": False }), 404
    except Exception as e:
        print(e)
        return jsonify({ "success": False, "error": -1 }), 500
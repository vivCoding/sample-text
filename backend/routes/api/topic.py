from flask import Blueprint, jsonify, request, session
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
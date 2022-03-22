from flask import Blueprint, jsonify, request, session
from itsdangerous import json
from database.topic import Topic

topic_blueprint = Blueprint("topic", __name__)

@topic_blueprint.route('/createtopic', methods=["POST"])
def create_topic():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		status, error_message = check_topic(data["topic_name"])
		if status == 0:
			new_topic = Topic(data["topic_name"], data["posts"])
			new_topic.push()
			return jsonify({ "success": True, "data": new_topic.to_dict() }), 200
		else:
			return jsonify({ "success": False }), 200
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@topic_blueprint.route('/findtopic', methods=["POST"])
def find_topic():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		topic_name = data["topic_name"]
		topic = Topic.find_by_name(topic_name)
		if topic is not None:
			return jsonify({ "success": True, "data": topic.to_dict() }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({ "success": False, "error": -1 }), 500
from flask import Blueprint, jsonify, request, session
from utils.check_creation_fields import check_creation_fields
from database.user import User
import json
import hashlib

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route('/')
def index():
	return "user index"

@user_blueprint.route('/createaccount', methods=["POST"])
def create_account():
	data = request.get_json()
	status = check_creation_fields(data["username"], data["email"], data["password"])
	username = data["username"]
	if username in session:
		return 302
	try:
		if status == 0:
			hashed_password = hashlib.md5(data["password"].encode())
			new_user = User(data["username"], data["email"], hashed_password.hexdigest())
			new_user.push()
			session[username] = username
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": False,"error": status }), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500

@user_blueprint.route('/login', methods=["POST"])
def login():
	data = request.get_json()
	hashed_password = hashlib.md5(data["password"].encode()).hexdigest()
	username = data["username"]
	if username in session:
		return 302
	try:
		user = User.find_by_credentials(data["username"], hashed_password)
		if user is not None:
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": True , "error": 1}), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500
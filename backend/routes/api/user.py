from flask import Blueprint, jsonify, request, session
from utils.check_creation_fields import check_creation_fields
from database.user import User
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
		return jsonify({ "success": True }), 302	# should go to the user timeline
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
		return jsonify({ "success": True }), 302	# should go to the user timeline
	try:
		user = User.find_by_credentials(data["username"], hashed_password)
		if user is not None:
			session[username] = username
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": True , "error": 1}), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500
		
@user_blueprint.route('/updateprofile', methods=['POST'])
def update_user():
	data = request.get_json()
	try:
		old_user = User.find_by_username(data["username"])
		if old_user is not None:
			new_user = User(username=old_user.username, email=old_user.email, password=old_user.password, 
														name=data["name"], bio=data["bio"], profile_img=data["profile_img"])
			User.delete_by_username(old_user.username)	
			new_user.push()
			if User.find_by_username(new_user.username) is not None:
				return jsonify({"success": True }), 200
			else:
				#-2 no error, but no user		s			
				return jsonify({"success": True, "error": -2 }), 500
		else:
			return jsonify({ "success": True , "error": 1}), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500
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
			return_dict = {"success": True}
			return_dict.update(user.to_dict)
			session[username] = username
			return jsonify(return_dict), 200
		else:
			return jsonify({ "success": True , "error": 1}), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500

@user_blueprint.route('/viewprofile', methods=["POST"])
def view_profile():
	data = request.get_json()
	username = data["username"]
	try:
		user = User.find_by_username(username)
		if user is not None:
			return_dict = {"success": True}
			return_dict.update(user.to_dict)
			return jsonify(return_dict), 200
		else:
			return jsonify({ "success": True , "error": 1}), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500
		
@user_blueprint.route('/editprofile', methods=["POST"])
def edit_profile():
	#TODO check session matches profile you are editing
	data = request.get_json()
	new_username = None
	new_profile_img = None
	new_bio = None
	new_name = None
	new_email = None
	new_password = None
	if 'username' in data:
		new_username = data['username']
	if 'profile_img' in data:
		new_profile_img = data['profile_img']
	if 'bio' in data:
		new_bio = data['bio']
	if 'name' in data:
		new_name = data['name']
	if 'email' in data:
		new_email = data['email']
	if 'password' in data:
		new_password = data['password']
		old_password = data['old_password']

@user_blueprint.route('/delete', methods=["POST"])
def delete_user():
	data = request.get_json()
	try:
		# check if valid session
		username = data["username"]
		User.delete_by_username(username)
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500
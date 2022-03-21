from flask import Blueprint, jsonify, request, session
from utils.encrypt import encrypt
from utils.validate_fields import check_account_fields, check_email, check_password, check_username
from database.user import User
import hashlib

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route('/')
def index():
	return jsonify("api user index")

@user_blueprint.route('/createaccount', methods=["POST"])
def create_account():
	if session.get('username') is not None:
		# already logged in
		return jsonify({ "success": True }), 302
	try:
		data = request.get_json()
		status, error_message = check_account_fields(data["username"], data["email"], data["password"])
		if status == 0:
			hashed_password =  encrypt(data["password"])
			new_user = User(data["username"], data["email"], hashed_password)
			new_user.push()
			session["username"] = data["username"]
			return jsonify({ "success": True, "data": new_user.to_dict() }), 200
		else:
			return jsonify({ "success": False,"error": status, "errorMessage": error_message }), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


@user_blueprint.route('/login', methods=["POST"])
def login():
	if session.get('username', None) is not None:
		# already logged in
		return jsonify({ "success": True }), 302
	try:
		data = request.get_json()
		hashed_password = encrypt(data["password"])
		user = User.find_by_credentials(data["loginField"], hashed_password)
		if user is not None:
			session["username"] = user.username
			return jsonify({ "success": True, "data": user.to_dict() }), 200
		else:
			return jsonify({ "success": False , "error": 1, "errorMessage": "Invalid username, email or password!"}), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/logout', methods=["POST"])
def logout():
	try:
		if session.get('username', None) is not None:
			session.pop('username')
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": False }), 401
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/getuser', methods=["POST"])
def get_user():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if username is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_username(username)
		if user is not None:
			return jsonify({
				"success": True,
				"data": user.to_dict()
			}), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/getprofile', methods=["POST"])
def get_profile():
	# do not proceed if user is not logged in
	print (session.get('username', 'no'))
	if session.get('username', None) is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		username = data["username"]
		user = User.find_by_username(username)
		if user is not None:
			return_dict = user.to_dict()
			return_dict.pop("username")
			return_dict.pop("email")
			return jsonify({ "success": True, "data": return_dict }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False, "error": -1 }), 500

@user_blueprint.route('/getaccount', methods=["POST"])
def get_account():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if username is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_username(username)
		if user is not None:
			return jsonify({
				"success": True,
				"data": { "username": user.username, "email": user.email }
			}), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/editprofile', methods=["POST"])
def edit_profile():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_username(username)
		if user is None:
			return jsonify({ "success": False }), 404
		# TODO: should probably check for field validity
		data = request.get_json()
		if 'profile_img' in data or 'bio' in data or 'name' in data:
			new_profile_img = data.get("profile_img", None)
			new_name = data.get("name", None)
			new_bio = data.get("bio", None)
			user.update_profile(new_name, new_bio, new_profile_img)
		return_dict = user.to_dict()
		return_dict.pop("username")
		return_dict.pop("email")
		return jsonify({ "success": True, "data": return_dict }), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


@user_blueprint.route('/editusername', methods=["POST"])
def edit_username():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": True , "error": 8}), 401
	try:
		user = User.find_by_username(username)
		if user is None:
			return jsonify({ "success": False }), 404
		data = request.get_json()
		new_username = data["newUsername"]
		status, errorMessage = check_username(new_username)
		if status == 0:
			user.update_username(new_username)
			session["username"] = new_username
			return jsonify({
				"success": True,
				"data": { "username": user.username, "email": user.email }
			}), 200
		else:
			return jsonify({ "success": False, "error": status, "errorMessage": errorMessage })
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/editemail', methods=["POST"])
def edit_email():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": True , "error": 8}), 401
	try:
		user = User.find_by_username(username)
		if user is None:
			return jsonify({ "success": False }), 404
		data = request.get_json()
		new_email = data["newEmail"]
		status, errorMessage = check_email(new_email)
		if status == 0:
			user.update_email(new_email)
			return jsonify({
				"success": True,
				"data": { "username": username, "email": user.email }
			}), 200
		else:
			return jsonify({ "success": False, "error": status, "errorMessage": errorMessage })
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500


@user_blueprint.route('/editpassword', methods=["POST"])
def edit_password():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_username(username)
		if user is None:
			return jsonify({ "success": False }), 404
		data = request.get_json()
		new_password = data["newPassword"]
		old_password = encrypt(data["oldPassword"])
		if user.password != old_password:
			return jsonify({
				"success": False,
				"error": 8,
				"errorMessage": "Incorrect old password!"
			}), 200
		status, errorMessage = check_password(new_password)
		if status == 0:
			user.update_password(encrypt(new_password))
			return jsonify({
				"success": True,
				"data": { "username": username, "email": user.email }
			}), 200
		else:
			return jsonify({ "success": False, "error": status, "errorMessage": errorMessage })
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/deleteuser', methods=["POST"])
def delete_user():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		password = encrypt(data["password"])
		user = User.find_by_username(username)
		if user is not None:
			if user.password == password:
				User.delete_by_username(username)
				session.pop('username')
				return jsonify({ "success": True }), 200
			else:
				return jsonify({ "success": False, "error": 1, "errorMessage": "Incorrect password!" }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/followtopic', methods=["POST"])
def follow_topic():
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_username(username)
		if user is not None:
			if user.follow_topic(data["topic_name"]):
				return jsonify({ "success": True }), 200
			else:
				return jsonify({ "success": False }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/unfollowtopic', methods=["POST"])
def unfollow_topic():
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_username(username)
		if user is not None:
			if user.unfollow_topic(data["topic_name"]):
				return jsonify({ "success": True }), 200
			else:
				return jsonify({ "success": False }), 200
		return jsonify({ "Success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500
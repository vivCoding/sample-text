from flask import Blueprint, jsonify, request, session
from database.conversation import Conversation
from utils.encrypt import encrypt
from utils.validate_fields import check_account_fields, check_email, check_password, check_username
from database.user import User
from database.post import Post
import hashlib

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route('/')
def index():
	return jsonify("api user index")

@user_blueprint.route('/createaccount', methods=["POST"])
def create_account():
	if session.get('user_id') is not None:
		# already logged in
		return jsonify({ "success": True }), 302
	try:
		data = request.get_json()
		status, error_message = check_account_fields(data["username"], data["email"], data["password"])
		if status == 0:
			hashed_password =  encrypt(data["password"])
			new_user = User(data["username"], data["email"], hashed_password)
			user_id = new_user.push()
			session["user_id"] = user_id
			return jsonify({ "success": True, "data": new_user.to_dict() }), 200
		else:
			return jsonify({ "success": False,"error": status, "errorMessage": error_message }), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


@user_blueprint.route('/login', methods=["POST"])
def login():
	if session.get('user_id', None) is not None:
		# already logged in
		return jsonify({ "success": True }), 302
	try:
		data = request.get_json()
		hashed_password = encrypt(data["password"])
		user = User.find_by_credentials(data["loginField"], hashed_password)
		if user is not None:
			session["user_id"] = user.user_id
			return jsonify({ "success": True, "data": user.to_dict() }), 200
		else:
			return jsonify({ "success": False , "error": 1, "errorMessage": "Invalid username, email or password!"}), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/logout', methods=["POST"])
def logout():
	try:
		if session.get('user_id', None) is not None:
			session.pop('user_id')
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": False }), 401
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

# returns user object of currently logged in person
@user_blueprint.route('/getuser', methods=["POST"])
def get_user():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
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

# returns user profile given any user_id 
@user_blueprint.route('/getprofile', methods=["POST"])
def get_profile():
	# do not proceed if user is not logged in
	user_id = session.get('user_id', None)
	try:
		data = request.get_json()
		username_or_id = data["username_or_id"]
		try: user = User.find_by_id(username_or_id)
		except: user = None
		if user is None:
			user = User.find_by_username(username_or_id)
		if user is not None:
			return_dict = user.to_dict()
			return_dict.pop("email")
			# we also want to sort the posts made, and not return the ones that are not anonymous
			# if the person logged in is getting their own profile, view everything
			if user.user_id != user_id:
				if user_id is None:
					for key in ["followers", "following", "posts", "followed_topics", "liked_posts", "comments", "saved_posts"]:
						return_dict.pop(key)
				else:
					filtered_posts = []
					for post_id in user.posts:
						post = Post.find(post_id)
						if post is not None and not post.anonymous: 
							filtered_posts.append(post_id)
					return_dict["posts"] = filtered_posts
			return jsonify({ "success": True, "data": return_dict }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False, "error": -1 }), 500

# returns user object's username and email of currently logged in person
@user_blueprint.route('/getaccount', methods=["POST"])
def get_account():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
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
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
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
		return_dict.pop("email")
		return jsonify({ "success": True, "data": return_dict }), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


@user_blueprint.route('/editusername', methods=["POST"])
def edit_username():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": True , "error": 8}), 401
	try:
		user = User.find_by_id(user_id)
		if user is None:
			return jsonify({ "success": False }), 404
		data = request.get_json()
		new_username = data["newUsername"]
		status, errorMessage = check_username(new_username)
		if status == 0:
			user.update_username(new_username)
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
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": True , "error": 8}), 401
	try:
		user = User.find_by_id(user_id)
		if user is None:
			return jsonify({ "success": False }), 404
		data = request.get_json()
		new_email = data["newEmail"]
		status, errorMessage = check_email(new_email)
		if status == 0:
			user.update_email(new_email)
			return jsonify({
				"success": True,
				"data": { "username": user.username, "email": user.email }
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
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
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
				"data": { "username": user.username, "email": user.email }
			}), 200
		else:
			return jsonify({ "success": False, "error": status, "errorMessage": errorMessage })
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/deleteuser', methods=["POST"])
def delete_user():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		password = encrypt(data["password"])
		user = User.find_by_id(user_id)
		if user is not None:
			if user.password == password:
				print("not my problem")
				# delete this user's posts
				for post_id in user.posts:
					Post.delete(post_id)
				for convo_id in user.conversations:
					Conversation.delete(convo_id)
				# delete this user
				User.delete_by_id(user_id)
				session.pop('user_id')
				return jsonify({ "success": True }), 200
			else:
				return jsonify({ "success": False, "error": 1, "errorMessage": "Incorrect password!" }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/followuser', methods=["POST"])
def follow_user():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(user_id)
		if user is not None:
			status = user.follow(data['user_id'])
			return jsonify({ "success": True, "status": status }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/unfollowuser', methods=["POST"])
def unfollow_user():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(user_id)
		if user is not None:
			status = user.unfollow(data['user_id'])
			return jsonify({ "success": True, "status": status }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@user_blueprint.route('/followtopic', methods=["POST"])
def follow_topic():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(user_id)
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
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(user_id)
		if user is not None:
			if user.unfollow_topic(data["topic_name"]):
				return jsonify({ "success": True }), 200
			else:
				return jsonify({ "success": False }), 200
		return jsonify({ "Success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/createconversation', methods=["POST"])
def create_convo():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		ret, convo_id = Conversation.create(user_id, data["recipient"])
		if ret == 3:
			return jsonify({ "success": True , "status": ret, "convo_id": convo_id}), 200
		else:
			return jsonify({ "success": False , "status": ret }), 200
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/deleteconversation', methods=["POST"])
def delete_convo():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		ret = Conversation.delete(data["conversation_id"])
		if ret == 1:
			return jsonify({ "success": True , "status": ret}), 200
		else:
			return jsonify({ "success": False , "status": ret }), 200
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/sendprivatemessage', methods=["POST"])
def send_message():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		convo = Conversation.find_by_id(data["conversation_id"])
		if convo == None:
			return jsonify({ "Success": False }), 404
		else:
			ret = convo.add_message(user_id, data["message"])
			if ret == 2:
				return jsonify({ "success": True , "status": ret}), 200
			return jsonify({ "success": False , "status": ret }), 200
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/getconversation', methods=["POST"])
def get_conversation():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		convo = Conversation.find_by_id(data["conversation_id"])
		if convo == None:
			return jsonify({ "Success": False }), 404
		else:
			return jsonify({
				"success": True,
				"data": convo.to_dict()
			}), 200
	except Exception as e:
		print(e)
		return jsonify({ "success": False }), 500

@user_blueprint.route('/updatemessagesetting', methods=["POST"])
def update_message_setting():
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(user_id)
		if user is not None:
			status = user.update_message_setting(data["message_setting"])
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

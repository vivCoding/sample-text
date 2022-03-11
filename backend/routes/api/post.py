from flask import Blueprint, jsonify, request, session
from utils.encrypt import encrypt
from utils.validate_fields import check_post_fields, check_comment
from database.user import User
from database.post import Post

post_blueprint = Blueprint("post", __name__)

@post_blueprint.route('/')
def index():
	return jsonify("api post index")

@post_blueprint.route('/createpost', methods=["POST"])
def create_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if username is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_username(username)
		if user is not None:
			# create a post
			data = request.get_json()
			status, error_message = check_post_fields(data["title"], data["caption"])
			if status == 0:
				new_post = Post(
					data["title"],
					data["topics"],
					data["username"],
					data["img"],
					data["caption"],
					data["anonymous"],
					data["likes"],
					data["comments"],
					data["date"],
					data["post_id"]
				)
				new_post.push()
				return jsonify({ "success": True, "data": new_post.to_dict() }), 200
			else:
				return jsonify({ "success": False,"error": status, "errorMessage": error_message }), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500


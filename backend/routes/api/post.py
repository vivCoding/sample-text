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

@post_blueprint.route('/deletepost', methods=["POST"])
def delete_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			Post.delete(post_id)
			return jsonify({ "success": True }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/likepost', methods=["POST"])
def like_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	username = session.get('username', None)
	if session.get('username') is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.like(username)
			return jsonify({
				"success": True,
				"data": { "likeCount": len(post.likes) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


from datetime import datetime
from flask import Blueprint, jsonify, request, session
from utils.encrypt import encrypt
from utils.validate_fields import check_post_fields, check_comment, check_topic
from database.user import User
from database.post import Post
from database.topic import Topic

post_blueprint = Blueprint("post", __name__)

@post_blueprint.route('/')
def index():
	return jsonify("api post index")

@post_blueprint.route('/createpost', methods=["POST"])
def create_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
		if user is not None:
			# create a post
			data = request.get_json()
			status, error_message = check_post_fields(data.get("title", ""), data.get("caption", ""))
			if status == 0:
				new_post = Post(
					data.get("title", ""),
					data.get("topic", ""),
					user_id,
					data.get("img", ""),
					data.get("caption", ""),
					data.get("anonymous", ""),
				)
				new_post.date = datetime.now().strftime('%Y/%m/%d, %H:%M:%S')
				# add this post under its topic in the database
				parent_topic = Topic.find_by_name(new_post.topic)
				if parent_topic is None:
					# create the topic and add the post to it
					topic_status, topic_err_msg = check_topic(new_post.topic)
					if topic_status == 0:
						parent_topic = Topic(new_post.topic, [])
						parent_topic.push()
					else:
						return jsonify({
							"success": False,
							"error": topic_status,
							"errorMessage": topic_err_msg,
						}), 200
				new_post.push()
				# topic exists, so add the post to it
				parent_topic.add_post(new_post.post_id)
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
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
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

@post_blueprint.route('/getpost', methods=["POST"])
def get_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			return_dict = post.to_dict()
			if post.anonymous and user_id != post.author_id:
				return_dict.pop("author_id")
			return jsonify({
				"success": True,
				"data": return_dict
			}), 200
		else:
			return jsonify({ "success": False }), 404
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/likepost', methods=["POST"])
def like_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.like(user_id)
			return jsonify({
				"success": True,
				"data": { "likeCount": len(post.likes) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/unlikepost', methods=["POST"])
def unlike_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.unlike(user_id)
			return jsonify({
				"success": True,
				"data": { "likeCount": len(post.likes) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/dislikepost', methods=["POST"])
def dislike_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.dislike(user_id)
			return jsonify({
				"success": True,
				"data": { "dislikeCount": len(post.dislikes) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/undislikepost', methods=["POST"])
def undislike_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.undislike(user_id)
			return jsonify({
				"success": True,
				"data": { "dislikeCount": len(post.dislikes) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/lovepost', methods=["POST"])
def love_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.love(user_id)
			return jsonify({
				"success": True,
				"data": { "loveCount": len(post.loves) }
			}), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/unlovepost', methods=["POST"])
def unlove_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		post_id = data["post_id"]
		post = Post.find(post_id)
		if post is not None:
			post.unlove(user_id)
			return jsonify({
				"success": True,
				"data": { "loveCount": len(post.loves) }
			}), 200
		return jsonify({ "success": False }), 500
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500


@post_blueprint.route('/commentonpost', methods=["POST"])
def comment_on_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their username in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		status, error_message = check_comment(data["comment"])
		if status == 0:
			post_id = data["post_id"]
			comment = data["comment"]
			post = Post.find(post_id)
			if post is not None:
				post.add_comment(user_id, comment)
				return jsonify({
					"success": True,
					"data": { "comments": post.comments }
				}), 200
			return jsonify({ "success": False }), 404
		else:
			return jsonify({ "success": False,"error": status, "errorMessage": error_message }), 200
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/savepost', methods=["POST"])
def save_post():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
		if user is not None:
			data = request.get_json()
			post_id = data["post_id"]
			post = Post.find(post_id)
			if post is not None:
				user.save_post(post.post_id)
				return jsonify({ "success": True, "data": post.to_dict() }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500

@post_blueprint.route('/unsavepost', methods=["POST"])
def unsave_post():
# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
		if user is not None:
			data = request.get_json()
			post_id = data["post_id"]
			post = Post.find(post_id)
			if post is not None:
				user.unsave_post(post.post_id)
				return jsonify({ "success": True, "data": post.to_dict() }), 200
		return jsonify({ "success": False }), 404
	except Exception as e:
		print(e)
		return jsonify({"success": False }), 500
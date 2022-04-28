from typing import OrderedDict
from flask import Blueprint, jsonify, request, session
from utils.encrypt import encrypt
from utils.validate_fields import check_post_fields, check_comment
from database.user import User
from database.post import Post
from database.topic import Topic
from datetime import datetime

userline_blueprint = Blueprint("userline", __name__)

@userline_blueprint.route('/')
def index():
	return jsonify("api userline index")

@userline_blueprint.route('/generateuserline', methods=["POST"])
def generate_userline():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		data = request.get_json()
		user = User.find_by_id(data["user_id"])
		if user is not None:
			userline = []
			# generate userline
			# interactions: like, comment, save, dislike, love
			# get posts user has liked
			for post_id in user.liked_posts:
				post = Post.find(post_id)
				if post:
					date = post.date
					userline.append([post_id, "Liked", date])
			# get posts user has commented on
			for post_id in user.comments:
				post = Post.find(post_id)
				if post:
					date = post.date
					userline.append([post_id, "Commented", date])
			# get user's saved posts
			for post_id in user.saved_posts:
				post = Post.find(post_id)
				if post:
					date = post.date
					userline.append([post_id, "Saved", date])
			# get posts user has disliked
			for post_id in user.disliked_posts:
				post = Post.find(post_id)
				if post:
					date = post.date
					userline.append([post_id, "Disliked", date])
			# get posts user has loved
			for post_id in user.loved_posts:
				post = Post.find(post_id)
				if post:
					date = post.date
					userline.append([post_id, "Loved", date])
			# sort mp by post creation time
			userline = sorted(userline, key = lambda x:datetime.strptime(x[2], '%Y/%m/%d, %H:%M:%S'), reverse=True)
			#print(userline)
			#assert 1 == 2
			return jsonify({ "success": True, "data": userline }), 200
		else:
			return jsonify({ "success": False }), 405
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500
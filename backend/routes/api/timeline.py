from flask import Blueprint, jsonify, request, session
from utils.encrypt import encrypt
from utils.validate_fields import check_post_fields, check_comment
from database.user import User
from database.post import Post
from database.topic import Topic
from datetime import datetime

timeline_blueprint = Blueprint("timeline", __name__)

@timeline_blueprint.route('/')
def index():
	return jsonify("api timeline index")

@timeline_blueprint.route('/generatetimeline', methods=["POST"])
def generate_timeline():
	# do not proceed if user is not logged in
	# if they are logged in, they should have their user_id in their session cookie
	user_id = session.get('user_id', None)
	if user_id is None:
		return jsonify({ "success": False }), 401
	try:
		user = User.find_by_id(user_id)
		if user is not None:
			timeline = []
			# get posts of the topics that the user follows
			followed_topics = user.followed_topics
			for topic_name in followed_topics:
				followed_topic = Topic.find_by_name(topic_name)
				if followed_topic is not None:
					if followed_topic.posts is not None:
						posts = followed_topic.posts
						for post_id in posts:
							if post_id not in timeline:
								timeline.append(post_id)
			# get posts of the users that the user follows
			following = user.following
			for user_id in following:
				followed_user = User.find_by_id(user_id)
				if followed_user is not None:
					if followed_user.posts is not None:
						posts = followed_user.posts
						for post_id in posts:
							if post_id not in timeline:
								timeline.append(post_id)
			# sort timeline posts by creation time
			timeline = sorted(timeline, key=lambda post_id: datetime.strptime(Post.find(post_id).date, '%Y/%m/%d, %H:%M:%S'))
			return jsonify({ "success": True, "data": timeline }), 200
		else:
			return jsonify({ "success": False }), 405
	except Exception as e:
		print (e)
		return jsonify({"success": False }), 500
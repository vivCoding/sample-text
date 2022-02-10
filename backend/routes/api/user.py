from flask import Blueprint, jsonify, request
from utils.checkCreationFields import checkCreationFields
from database.user import User

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route('/')
def index():
	return "user index"

@user_blueprint.route('/createaccount', methods=["POST"])
def create_account():
	data = request.get_json()
	status = checkCreationFields(data["username"], data["email"], data["password"])
	try:
		if status == 0:
			# TODO: cookies
			new_user = User(data["username"], data["email"], data["password"])
			new_user.push()
			return jsonify({ "success": True }), 200
		else:
			return jsonify({ "success": False,"error": status }), 200
	except Exception as e:
		return jsonify({"success": False, "error": -1 }), 500

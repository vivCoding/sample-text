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
			return 200, jsonify({ "success": True })
		else:
			return 200, jsonify({ "success": False,"error": status })
	except Exception as e:
		return 500, jsonify({"success": False, "error": -1 })

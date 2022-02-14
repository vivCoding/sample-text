from distutils.log import debug
from dotenv import load_dotenv
from database.connect import Connection
from flask import Flask, jsonify
from routes.api.user import user_blueprint
import json

load_dotenv()
Connection.init()

app = Flask(__name__)

@app.route("/")
def index():
	return jsonify("Hello world")

app.register_blueprint(user_blueprint, url_prefix="/api/user")

if __name__ == "__main__":
	app.run("0.0.0.0", port = 5000, debug=True)
	print ("Server running on port 5000!", "=" * 50)


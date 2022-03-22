from dotenv import load_dotenv

from database.connect import Connection
from flask import Flask, jsonify
from flask_session import Session
from routes.api.user import user_blueprint
from routes.api.post import post_blueprint
from routes.api.topic import topic_blueprint
from flask_cors import CORS

load_dotenv()
Connection.init()

app = Flask(__name__)
CORS(app, methods=["OPTIONS", "GET", "POST"], supports_credentials=True)
app.config.from_object("config.Config")
Session(app)

@app.route("/")
def index():
	return jsonify("welcome to the backend!")

app.register_blueprint(user_blueprint, url_prefix="/api/user")
app.register_blueprint(post_blueprint, url_prefix="/api/post")
app.register_blueprint(topic_blueprint, url_prefix="/api/topic")

if __name__ == "__main__":
	print ("Server running on port 5000!\n", "=" * 50)
	app.run("0.0.0.0", port=5000, debug=True)

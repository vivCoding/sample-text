from dotenv import load_dotenv

from database.connect import Connection
from flask import Flask, jsonify
from flask_session import Session
from routes.api.user import user_blueprint

load_dotenv()
Connection.init()

app = Flask(__name__)
app.config.from_object("config.Config")
Session(app)

@app.route("/")
def index():
	return jsonify("welcome to the backend!")

app.register_blueprint(user_blueprint, url_prefix="/api/user")

if __name__ == "__main__":
	print ("Server running on port 5000!\n", "=" * 50)
	app.run("0.0.0.0", port=5000, debug=True)

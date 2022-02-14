### File: app.py

**app.route("/")**
**description**: an index route that returns a default index

### File: /routes/api/user.py

**@user_blueprint.route('/')**
**description**: an index route that returns a default index

**@user_blueprint.route('/createaccount')**
**description**: Creates an account, fethcing username, email, and password from 
the creation fields
**returns** status *200*, success and pushes 
to the database if credentials are right
**returns** status *200*, not success if 
there are bad credentials
**returns** status *500*, if could not communicate with the client
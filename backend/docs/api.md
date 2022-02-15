# API Documentation

All API routes should be documented in `docs/` in appropriate markdown file, with the following format, clearly specifying
- URL route path
- Route type (e.g. GET, POST)
- query parameters (if applicable)
- body parameters (if applicable)
- response type and meanings

# User
## `POST /api/user/createaccount`

Creates an account, validates given parameters, and stores into MongoDB based on username

<<<<<<< HEAD
**@user_blueprint.route('/createaccount')**
**description**: Creates an account, fethcing username, email, and password from 
the creation fields
**returns** status *200*, success and pushes 
to the database if credentials are right
**returns** status *200*, not success if 
there are bad credentials
**returns** status *500*, if could not communicate with the client
=======
### Request Body
```json
{
    "username": "string",
    "email": "string",
    "password": "string",
}
```
### Response Types
```json
{
    "success": true | false,
    "error": int
}
```
- Error 1: Username length is not between 1 and 20, inclusive
- Error 2: Username contains invalid characters
- Error 3: Email is not a valid email
- Error 4: Password length is not between 8 and 25, inclusive
- Error 5: Password contains invalid characters
- Error 6: A user with the desired username already exists
- Error 7: A user with the desired email address already exists

## `POST /api/user/login`

Logs in a user
<!-- TODO: fill out rest -->
>>>>>>> dev

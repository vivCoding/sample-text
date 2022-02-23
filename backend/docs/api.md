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


### Request Body
```json
{
    "username": "string",
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
- Error 1: Given username/email and password cannot be found


## `POST /api/user/viewprofile`

Returns user profile given username or email

### Request Body
```json
{
    "username": "string",
}
```
### Response Types
```json
{
    "success": true | false,
    "error": int
}
```
- Error 1: Given username/email cannot be found


## `POST /api/user/editprofile`

Updates the user's profile

### Request Body
```json
{
    "username": "string",
}
```
### Response Types
```json
{
    "success": true | false,
    "error": int
}
```
- Error 1: Attempting to edit profile when not in a session
- Error 2: Incorrect old password when attempting to change password

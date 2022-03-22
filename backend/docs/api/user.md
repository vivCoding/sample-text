# User
## `POST /api/user/createaccount`

Creates an account, validates given parameters, and stores into MongoDB based on username. Returns the created user

### Request Body
```json
{
"username": string,
    "email": string,
    "password": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "errorMessage": string | undefined, 
    "data": {
        "username": string,
        "email": string,
        "name": string,
        "bio": string,
        "profile_img": string
    }
}
```
- Error 1: Username length is not between 1 and 20, inclusive
- Error 2: Username contains invalid characters
- Error 3: Email is not a valid email
- Error 4: Password length is not between 8 and 25, inclusive
- Error 5: Password contains invalid characters
- Error 6: A user with the desired username already exists
- Error 7: A user with the desired email address already exists
- Response status code 302 is user is already logged in


## `POST /api/user/login`

Logs in a user using username or email and password, and returns the user information if successful


### Request Body
```json
{
    "loginField": string,
    "password": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "errorMessage": string | undefined,
    "data": {
        "username": string,
        "email": string,
        "name": string,
        "bio": string,
        "profile_img": string
    }
}
```
- Error 1: Given username/email and password cannot be found
- Response status code 302 is user is already logged in


## `POST /api/user/logout`

Logs out current user

### Response Types
```json
{
    "success": boolean,
}
```
- Response status 200 if usre logs out successfully
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)


## `POST /api/user/getuser`

Returns currently logged in user's info

### Response Types
```json
{
    "success": boolean,
    "data": {
        "username": string,
        "email": string,
        "name": string,
        "bio": string,
        "profile_img": string
    }
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if given username could not be found

## `POST /api/user/getprofile`

Returns user profile given username

### Request Body
```json
{
    "username": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "data": {
        "name": string,
        "bio": string,
        "profile_img": string
    }
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if given username could not be found

## `POST /api/user/getaccount`

Returns user account for user logged in

### Response Types
```json
{
    "success": boolean,
    "data": {
        "username": string,
        "email": string,
    }
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found

## `POST /api/user/editprofile`

Updates the user's profile for user logged in

### Response Types
```json
{
    "success": boolean,
    "data": {
        "name": string,
        "bio": string,
        "profile_img": string
    }
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found


## `POST /api/user/getaccount`

Returns user account for user logged in

### Response Types
```json
{
    "success": boolean,
    "data": {
        "username": string,
        "email": string,
    }
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found

## `POST /api/user/editusername`

Updates the user's username for user logged in

### Request Body
```json
{
    "newUsername": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "data": {
        "username": string,
        "email": string,
    }
}
```
- Error 1: Username length is not between 1 and 20, inclusive
- Error 2: Username contains invalid characters
- Error 6: A user with the desired username already exists
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found


## `POST /api/user/editemail`

Updates the user's email for user logged in

### Request Body
```json
{
    "newEmail": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "data": {
        "username": string,
        "email": string,
    }
}
```
- Error 3: Email is not a valid email
- Error 7: A user with the desired email address already exists
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found

## `POST /api/user/editpassword`

Updates the user's password for user logged in

### Request Body
```json
{
    "oldPassword": string,
    "newPassword": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "data": {
        "username": string,
        "email": string,
    }
}
```
- Error 4: Password length is not between 8 and 25, inclusive
- Error 5: Password contains invalid characters
- Error 8: Old password does not match password in database
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found

## POST /api/user/followtopic

Follows a specific topic

### Request Body
```json
{
    "topic_name": string
}
```
### Response Types
```json
{
    "success": boolean
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found

## POST /api/user/unfollowtopic

Unfollows a specific topic

### Request Body
```json
{
    "topic_name": string
}
```
### Response Types
```json
{
    "success": boolean
}
```
- Response status 401 if user is not authorized (e.g. does not have valid session cookie)
- Response status 404 if username in session cookie cannot be found
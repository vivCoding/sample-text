# Post
## `POST /api/post/createpost`

Creates a post, validates given parameters, and stores into MongoDB. Returns the created post

### Request Body
```json
{
    "title": string,
    "topic": string,
    "author_id": string,
    "img": string,
    "caption": string,
    "anonymous": string,
    "likes": string,
    "comments": string,
    "date": string,
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
    "errorMessage": string | undefined, 
    "data": {
        "title": string,
        "topic": string,
        "author_id": string,
        "img": string,
        "caption": string,
        "anonymous": string,
        "likes": string,
        "comments": string,
        "date": string,
        "post_id": string
    }
}
```
- Error 1: Title length is 0 or greater than 200 characters
- Error 2: Caption length is greater than 2000 characters
- Response status code 401 user is not logged in
- Response status code 500 exception during execution

## `POST /api/post/deletepost`

Deletes a post, removing it from MongoDB

### Request Body
```json
{
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "error": int | undefined,
}
```
- Response status code 401 user is not logged in
- Response status code 404 post does not exist
- Response status code 500 exception during execution

## `POST /api/post/getpost`

Returns info of requested post

### Request Body
```json
{
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "errorMessage": string | undefined, 
    "data": {
        "title": string,
        "topic": string,
        "author_id": string,
        "img": string,
        "caption": string,
        "anonymous": string,
        "likes": string,
        "comments": string,
        "date": string,
        "post_id": string
    }
}
```
- Response status code 401 user is not logged in
- Response status code 404 post does not exist
- Response status code 500 exception during execution

## `POST /api/post/likepost`

Like a post, incrementing the total and recording the user who liked the post in MongoDB. Returns the new number of likes on the post

### Request Body
```json
{
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "errorMessage": string | undefined, 
    "data": {
        "likeCount": int
    }
}
```
- Response status code 401 user is not logged in
- Response status code 404 post does not exist
- Response status code 500 exception during execution

## `POST /api/post/unlikepost`

Unlikes a post, removing the user_id from the list of users. Returns the new number of likes

### Request Body
```json
{
    "post_id": string
}
```

### Response Types
```json
{
    "success": boolean,
    "data": {
        "likeCount": int
    }
}
```
- Response status code 401 if user is not logged in
- Response status code 404 if post does not exist
- Response status code 500 if exception occurs during execution1

## `POST /api/post/commentonpost`

Comment on a post, recording the user and the comment as a list in MongoDB. Returns the new list of user, comment pairs on the post

### Request Body
```json
{
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "errorMessage": string | undefined, 
    "data": {
        "comments": list(list(str, str))
    }
}
```
- Error 1: Comment length is 0 or greater than 500 characters
- Response status code 401 user is not logged in
- Response status code 404 post does not exist
- Response status code 500 exception during execution

## `POST /api/post/savepost`

Save a post in MongoDB for the logged in user. Returns the post that was saved

### Request Body
```json
{
    "post_id": string
}
```
### Response Types
```json
{
    "success": boolean,
    "errorMessage": string | undefined, 
    "data": {
        "title": string,
        "topic": string,
        "username": string,
        "img": string,
        "caption": string,
        "anonymous": string,
        "likes": string,
        "comments": string,
        "date": string,
        "post_id": string
    }
}
```
- Response status code 401 user is not logged in
- Response status code 404 post does not exist
- Response status code 500 exception during execution
# Timeline
## `TIMELINE /api/timeline/generatetimeline`

Generates the timeline for the user that is signed in. Returns the timeline as a list of post IDs

### Request Body
```
NONE
```

### Response Types
```json
{
    "success": boolean,
    "errorMessage": string | undefined, 
    "data": {
        [post_id]
    }
}
```
- Response status code 401 user is not logged in
- Response status code 405 could not find user in the database
- Response status code 500 exception during execution

## `POST /api/topic/createtopic`

Creates a new topic

### Request Body
```json
{
    "topic_name": string,
    "posts": list,
}
```
### Response Types
```json
{
    "success": boolean,
    "data": {
        "topic_name": string,
        "posts": list,
    }
}
```

## `POST /api/topic/findtopic`

Finds a topic by name

### Request Body
```json
{
    "topic_name": string,
}
```
### Response Types
```json
{
    "success": boolean,
    "data": {
        "topic_name": string,
        "posts": list,
    }
}
```
- - Response status 404 if no topic with the same name is found
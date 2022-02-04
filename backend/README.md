# Setup

Ensure you have Python 3.6+

Create virtual environment:

```
python3 -m venv venv
```

Activate environment
```
. venv/bin/activate
```
If you are on Windows:
```
./venv/Scripts/Activate
```

Install necessary packages:
```
pip3 install -r requirements.txt
```

To connect to MongoDB, create a `.env` file in the backend directory, and add the following:
```
ATLAS_URL=<insert_mongodb_url>
```

# Folder Structure

(speculative)
```
├── database
│   ├── connect.py
│   ├── user.py
│   ├── post.py
│   ├── topic.py
│   ├── message.py
│   ├── convo.py
│   ├── misc.py
├── routes
│   ├── api
│   |   ├── user.py
│   |   ├── post.py
│   |   ├── topic.py
│   |   ├── convo.py
│   |   ├── message.py
│   |   ├── misc.py
├── utils
│   ├── valid_email.py
│   ├── parse_something.py
│   ├── etc.py
├── app.py
├── config.py
├── .env
└── .gitignore
```

- `database` should contain all the database source code, such as:
    - initial connection
    - functions to search/update objects from specific collections

- `routes` should contain all api routes, each split up into different files for each path 
    - e.g. `/api/user/getprofile` and `/api/topic/search`

- `utils` should contain misc utility functions for our use. For example:
    - helper function to parse/validate an email
    - etc

# Documentation

All API routes should be documented in `docs/` in appropriate markdown file, with the following format, clearly specifying
- URL route path
- query parameters
- body parameters
- response type
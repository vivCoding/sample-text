- [Setup](#Setup)
- [Folder-Structure](#Folder-Structure)
- [API Docs](docs/api.md)
- [Testing](docs/tests.md)

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
├── docs
├── routes
│   ├── api
│   |   ├── user.py
│   |   ├── post.py
│   |   ├── topic.py
│   |   ├── convo.py
│   |   ├── message.py
│   |   ├── misc.py
├── tests
│   ├── db_tests.py
│   ├── routes.py
│   ├── checkCreationFields.py
│   ├── etc.py
├── utils
│   ├── valid_email.py
│   ├── parse_something.py
│   ├── etc.py
├── app.py
├── config.py
├── runtests.py
├── requirements.txt
├── .env
└── .gitignore
```

- `database` should contain all the database source code, such as:
    - initial connection
    - functions to search/update objects from specific collections

- `routes` should contain all api routes, each split up into different files for each path 
    - e.g. `/api/user/getprofile` and `/api/topic/search`

- `tests` should contain code to test util functions and routes
    - The main driver for running tests is `runtests.py`

- `utils` should contain misc utility functions for our use. For example:
    - helper function to parse/validate an email
    - etc
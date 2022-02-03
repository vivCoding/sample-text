# Setup

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
<!-- 
# Folder Structure

```
├── database
│   ├── connect.py
│   ├── index.js
├── public
│   ├── css
│   │   ├── **/*.css
│   ├── images
│   ├── js
│   ├── index.html
├── dist (or build
├── node_modules
├── package.json
├── package-lock.json 
└── .gitignore
```

- `database` should contain all the database source code, such as:
    - initial connection
    - functions to access objects from specific collections
    - functions to access -->
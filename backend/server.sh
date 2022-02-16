#\/usr/bin/bash
gunicorn app:app -w 4 -b :5000
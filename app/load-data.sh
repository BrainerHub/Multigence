##!/bin/sh
rm config/db.sqlite3
python manage.py migrate
python manage.py loaddata fixtures/sample-data.json

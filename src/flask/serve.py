# It would be awesome if adding pages like "projects" or "news stories" on the edit page would generate
# the AngularJS controllers automatically.

# Maybe have a special (only when authenticated) interface that serves some page
# or entry even if it is hidden. So that the user can preview a new page or entry
# before he really shows it on the live site.

# Have API methods that return a just the shallow JSON of a requested page and one that also returns
# all the entries contained on the page as fields in the object, or in a separate entries' list of
# entry objects.

from flask import Flask, send_file, request
from pymongo import MongoClient
from time import strftime
from pprint import pprint

import json
import jsonpickle
import os

from utils.faker import create_fakes
from entities.page import Page

mongo = MongoClient() # Mongo DB client shared among request contexts.
app = Flask(__name__)


# Delivering HTML
@app.route("/")
def hello():
    return send_file('static/view-index.html')
@app.route("/edit")
def edit():
    return send_file('static/edit-index.html')


# REST methods for Page
@app.route('/edit/store/page', methods = ['POST'])
def store_page():

    incoming_json = request.get_json() # dict
    incoming_page = Page(incoming_json)
    incoming_page.modification_date = now()

    db_page = mongo.dede.pages.find_one(get_id(incoming_json))

    if db_page is None:
        incoming_page.creation_date = now()
        mongo.dede.pages.insert(incoming_page.json_dict())
    else:
        mongo.dede.pages.update(get_id(incoming_json), incoming_page.json_dict())
    return 'ok'

@app.route('/edit/delete/page', methods = ['POST'])
def delete_page():
    incoming_json = request.get_json() # dict
    mongo.dede.pages.remove(get_id(incoming_json))
    return 'ok'

@app.route('/edit/get/pageNames', methods = ['GET'])
def get_page_names():
    raw_pages = mongo.dede.pages.find()
    names = []
    for raw_page in raw_pages:
        page = Page(raw_page)
        names.append(page.name)
    return json.dumps(names)

@app.route('/edit/get/page/<page_name>', methods = ['GET'])
def get_page(page_name):
    raw_page = mongo.dede.pages.find_one({'name': page_name}) # Create an index on "name"?
    if raw_page is not None:
        return json.dumps(raw_page)
    else:
        return json.dumps({});


# REST methods for Entry
@app.route('/edit/store/entry', methods = ['POST'])
def store_entry():

    incoming_json = request.get_json() # dict
    incoming_entry = Entry(incoming_json)
    incoming_entry.modification_date = now()

    db_entry = mongo.dede.entries.find_one(get_id(incoming_json))

    if db_entry is None:
        incoming_entry.creation_date = now()
        mongo.dede.entries.insert(incoming_entry.json_dict())
    else:
        mongo.dede.entries.update(get_id(incoming_json), incoming_entry.json_dict())

    # Must also update the full list of tags. Extract into service.
    existing_tags = mongo.dede.tags.find()
    existing_tag_names = []
    for existing_tag in existing_tags:
        existing_tag_names.append(existing_tag.name)
    
    new_tag_names = []
    for tag in incoming_entry.tags:
        if tag not in existing_tag_names:
            new_tag_names.append(tag)
    
    for new_tag_name in new_tag_names:
        mongo.dede.tags.insert(Tag(new_tag_name).json_dict())

    return 'ok'

@app.route('/edit/delete/entry', methods = ['POST'])
def delete_entry():
    incoming_json = request.get_json() # dict
    mongo.dede.entries.remove(get_id(incoming_json))
    return 'ok'

@app.route('/edit/get/entryNames', methods = ['GET'])
def get_entry_names():
    raw_entries = mongo.dede.entries.find()
    names = []
    for raw_entry in raw_entries:
        entry = Entry(raw_entry)
        names.append(entry.name)
    return json.dumps(names)

@app.route('/edit/get/entry/<entry_name>', methods = ['GET'])
def get_entry(entry_name):
    raw_entry = mongo.dede.entries.find_one({'name': entry_name}) # Create an index on "name"?
    if raw_entry is not None:
        return json.dumps(raw_entry)
    else:
        return json.dumps({});


def now():
    return strftime("%Y-%m-%d %H:%M:%S")

def get_id(json):
    return {'_id': json['_id']}



if __name__ == "__main__":
    app.run(debug=True)


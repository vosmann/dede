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

    raw_json = request.get_json() # dict
    retrieved_page = mongo.dede.pages.find_one(get_id(raw_json))

    incoming_page = Page(raw_json)
    incoming_page.modification_date = now()

    if retrieved_page is None:
        incoming_page.creation_date = now()
        mongo.dede.pages.insert(incoming_page.json_dict())
    else:
        mongo.dede.pages.update(get_id(raw_json), incoming_page.json_dict())
    return 'ok'

@app.route('/edit/delete/page', methods = ['POST'])
def delete_page():
    raw_json = request.get_json() # dict
    mongo.dede.pages.remove(get_id(raw_json))
    return 'ok'

@app.route('/edit/get/pages', methods = ['GET'])
def get_pages():
    raw_pages = mongo.dede.pages.find()
    names = []
    for raw_page in raw_pages:
        page = Page(raw_page)
        names.append(page.name)
    return json.dumps(names)

@app.route('/edit/get/page/<page_name>', methods = ['GET'])
def get_page(page_name):
    raw_page = mongo.dede.pages.find_one({'name': page_name})
    if raw_page is not None:
        return json.dumps(raw_page)
    else:
        return json.dumps({});


# REST methods for Entry
@app.route('/edit/store/entry', methods = ['POST'])
def storeEntry():
    print "about to store an entry!"
    print request.get_json()
    return 'ok'



def now():
    return strftime("%Y-%m-%d %H:%M:%S")

def get_id(raw_json):
    return {'_id': raw_json['_id']}



if __name__ == "__main__":
    app.run(debug=True)


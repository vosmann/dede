# It would be awesome if adding pages like "projects" or "news stories" on the edit page would generate
# the AngularJS controllers automatically.

# Maybe have a special (only when authenticated) interface that serves some page
# or entry even if it is hidden. So that the user can preview a new page or entry
# before he really shows it on the live site.

# Have API methods that return a just the shallow JSON of a requested page and one that also returns
# all the entries contained on the page as fields in the object, or in a separate entries' list of
# entry objects.

# There is perhaps some redundant conversions from json/dicts to objects and vice-versa.
# The idea behind using the objects is to give some structure to the domain entities and to not do
# too much dirty work with dicts everywhere.

from flask import Flask, send_file, request
from pymongo import MongoClient
from time import strftime
from pprint import pprint

import json
import jsonpickle
import os

from utils.faker import create_fakes
from entities.page import Page
from entities.entry import Entry, extract_page_name

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

    db_page = mongo.dede.pages.find_one(id_query_from_obj(incoming_json))

    if db_page is None:
        incoming_page.creation_date = now()
        mongo.dede.pages.insert(incoming_page.json_dict())
    else:
        print id_query_from_obj(incoming_json)
        mongo.dede.pages.update(id_query_from_obj(incoming_json), incoming_page.json_dict())
    return 'ok'

@app.route('/edit/delete/page', methods = ['POST'])
def delete_page():
    incoming_json = request.get_json() # dict
    mongo.dede.pages.remove(id_query_from_obj(incoming_json))
    return 'ok'

@app.route('/edit/get/pageNames', methods = ['GET'])
def get_page_names():
    db_pages = mongo.dede.pages.find()
    names = []
    for db_page in db_pages:
        page = Page(db_page)
        names.append(page.name)
    return json.dumps(names)

@app.route('/edit/get/page/<page_name>', methods = ['GET'])
def get_page(page_name):
    db_page = mongo.dede.pages.find_one(name_query(page_name)) # Create an index on "name"?
    if db_page is not None:
        return json.dumps(db_page)
    else:
        return json.dumps({});


# REST methods for Entry
@app.route('/edit/store/entry', methods = ['POST'])
def store_entry():

    # Store entry.
    incoming_json = request.get_json() # dict
    incoming_entry = Entry(incoming_json)
    incoming_entry.modification_date = now()

    db_entry = mongo.dede.entries.find_one(id_query_from_obj(incoming_json))

    if db_entry is None:
        incoming_entry.creation_date = now()
        mongo.dede.entries.insert(incoming_entry.json_dict())
    else:
        mongo.dede.entries.update(id_query_from_obj(incoming_json), incoming_entry.json_dict())

    # Add it to the list of entries of its page (if not already there).
    page_name = extract_page_name(incoming_json)
    db_page = mongo.dede.pages.find_one(name_query(page_name))
    if db_page is not None:
        page = Page(db_page)
        if incoming_entry._id not in page.entry_ids:
            page.entry_ids.append(incoming_entry._id)
            mongo.dede.pages.update(id_query_from_obj(db_page), page.json_dict())
    else:
        print "looked for page with name {0} and got None. Will not update page entries".format(page_name)

    # Must also update the full list of tags. Extract into service.
    #existing_tags = mongo.dede.tags.find()
    #existing_tag_names = []
    #for existing_tag in existing_tags:
        #existing_tag_names.append(existing_tag.name)
    #new_tag_names = []
    #for tag in incoming_entry.tags:
        #if tag not in existing_tag_names:
            #new_tag_names.append(tag)
    #for new_tag_name in new_tag_names:
        #mongo.dede.tags.insert(Tag(new_tag_name).json_dict())

    return 'ok'

@app.route('/edit/delete/entry', methods = ['POST'])
def delete_entry():
    incoming_json = request.get_json() # dict
    mongo.dede.entries.remove(id_query_from_obj(incoming_json))
    return 'ok'

@app.route('/edit/get/entryNames/<page_name>', methods = ['GET'])
def get_entry_names(page_name):

    print "In function: get_entry_names({0})".format(page_name)

    db_page = mongo.dede.pages.find_one(name_query(page_name))
    entry_names = []

    if db_page is not None:
        page = Page(db_page)

        #
        print "Made a page object: {0}".format(json.dumps(page.json_dict()))
        print "Entry list: {0}".format(json.dumps(page.entry_ids))

        for entry_id in page.entry_ids:
            #
            print "Trying to get entry with ID: {0}".format(entry_id)
            print "Query: {0}".format(json.dumps(id_query(entry_id)))
                
            db_entry = mongo.dede.entries.find_one(id_query(entry_id)) # I cri on every fidn.

            #
            print "db_entry:"
            print db_entry

            if db_entry is not None:
                entry = Entry(db_entry)
                entry_names.append(entry.name)
                print "Entry name {0}".format(json.dumps(entry.json_dict()))
                print "Appended entry name {0}".format(entry.name)
    else:
        print "No page found with name {0}".format(page_name)

    return json.dumps(entry_names)

@app.route('/edit/get/entry/<entry_name>', methods = ['GET'])
def get_entry(entry_name):
    raw_entry = mongo.dede.entries.find_one({'name': entry_name}) # Create an index on "name"?
    if raw_entry is not None:
        return json.dumps(raw_entry)
    else:
        return json.dumps({});


def now():
    return strftime("%Y-%m-%d %H:%M:%S")

def id_query_from_obj(json):
    return {'_id': json['_id']}

def id_query(id):
    return {'_id': id}

def name_query(name):
    return {'name': name}




if __name__ == "__main__":
    app.run(debug=True)


# Clean up imports
from flask import Flask, send_file, request
from pymongo import MongoClient

import json
import jsonpickle
import os
import gridfs
import urllib, cStringIO

from entities.page import Page
from entities.entry import Entry


mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.dede_images)
app = Flask(__name__)


# Delivering HTML
@app.route("/")
def hello():
    return send_file('static/view-index.html')


# REST methods for Page
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
@app.route('/edit/get/entryNames/<page_name>', methods = ['GET'])
def get_entry_names(page_name):

    db_page = mongo.dede.pages.find_one(name_query(page_name))
    entry_names = []

    if db_page is not None:
        page = Page(db_page)
        for entry_id in page.entry_ids:
            db_entry = mongo.dede.entries.find_one(id_query(entry_id)) # I cri on every fidn.
            if db_entry is not None:
                entry = Entry(db_entry)
                entry_names.append(entry.name)
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

@app.route('/edit/get/elementTypes', methods = ['GET'])
def get_element_types():
    types = ["title", "text", "image"] # These are hard coded in markup. So, that's just great.
    return json.dumps(types)


# Tags
@app.route('/edit/get/tags', methods = ['GET'])
def get_tags():
    tags = []
    db_tags = mongo.dede.tags.find()
    for db_tag in db_tags:
        tags.append(db_tag)
    print "all tags"
    print tags
    return json.dumps(tags)


# Images
@app.route('/edit/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata():
    print "id:{0}, query: {1}".format(id, id_query(id))
    db_metadata = mongo.dede.image_metadata.find_one(id_query(id))
    print "db_metadata:"
    print db_metadata
    return json.dumps(db_metadata)

@app.route('/edit/get/image/metadata/all', methods = ['GET'])
def get_all_images_metadata():
    all_metadata = []
    all_db_metadata = mongo.dede.image_metadata.find()
    for db_metadata in all_db_metadata:
        all_metadata.append(db_metadata)

    print "all metadata"
    print all_metadata
    return json.dumps(all_metadata)

@app.route('/edit/get/image/<id>', methods = ['GET'])
def get_image(id):
    print "getting image by id {0}".format(id)
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')


def id_query(id):
    return {'_id': id}

def name_query(name):
    return {'name': name}


if __name__ == "__main__":
    app.run(debug=True)


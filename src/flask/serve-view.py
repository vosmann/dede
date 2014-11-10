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
@app.route('/get/pages', methods = ['GET'])
def get_pages():
    db_pages = mongo.dede.pages.find()
    pages = {}
    # TODO list comprehension much?
    for db_page in db_pages:
        page = Page(db_page)
        if page.is_shown:
            pages[page.name] = page.entries;
    return json.dumps(pages)


@app.route('/get/entry/<entry_id>', methods = ['GET'])
def get_entry(entry_id):
    raw_entry = mongo.dede.entries.find_one({'name': entry_name}) # Create an index on "name"?
    if raw_entry is not None:
        return json.dumps(raw_entry)
    else:
        return json.dumps({});

@app.route('/get/elementTypes', methods = ['GET'])
def get_element_types():
    types = ["title", "text", "image"] # These are hard coded in markup. So, that's just great.
    return json.dumps(types)


# Tags
@app.route('/get/tags', methods = ['GET'])
def get_tags():
    tags = []
    db_tags = mongo.dede.tags.find()
    for db_tag in db_tags:
        if db_tag.use:
            tags.append(db_tag)
    print "all tags"
    print tags
    return json.dumps(tags)


# Images
@app.route('/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata():
    print "id:{0}, query: {1}".format(id, id_query(id))
    db_metadata = mongo.dede.image_metadata.find_one(id_query(id))
    print "db_metadata:"
    print db_metadata
    return json.dumps(db_metadata)

@app.route('/get/image/<id>', methods = ['GET'])
def get_image(id):
    print "getting image by id {0}".format(id)
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')


def id_query(id):
    return {'_id': id}


if __name__ == "__main__":
    app.run(debug=True, port=4000)


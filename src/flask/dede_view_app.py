# Clean up imports
from flask import Flask, send_file, request
from werkzeug.contrib.fixers import ProxyFix
from pymongo import MongoClient

import json
import sys
import os
import sys
import gridfs
import urllib, cStringIO

from entities.page import Page
from entities.view_page import ViewPage
from entities.entry import Entry
from entities.view_entry import ViewEntry


mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.dede_images)
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route("/")
def main():
    print "Serving view-index.html."
    return send_file('static/view-index.html')

@app.route('/get/pageIdsAndNames', methods = ['GET'])
def get_page_ids_and_names():
    db_pages = mongo.dede.pages.find()
    pages = [ Page(db_page) for db_page in db_pages ]
    sorted_pages = sorted(pages, key=lambda k: k.creation_date)
    # I too once used dict comprehensions.
    # ids_and_names = { page._id: page.name for page in sorted_pages if page.is_shown }
    ids_and_names = [ {'id': page._id, 'name': page.name} for page in sorted_pages if page.is_shown ]
    return json.dumps(ids_and_names)

@app.route('/get/page/<page_id>', methods = ['GET'])
def get_page(page_id):
    db_pages = mongo.dede.pages.find()
    pages = [Page(db_page) for db_page in db_pages if Page(db_page).is_shown] # cache
    page_map = {page._id: page for page in pages} # stupid. cache assembled view pages instead.
    requested_page = page_map[page_id]
    return json.dumps(assemble_view_page(requested_page))

# A "view page" is a list of completely assembled pages ready to be shown.
# Must move into a separate module, obviously.
def assemble_view_page(page):
    view_entries = {}
    ordered_entry_ids = []
    for entry_id in page.entry_ids:
        db_entry = mongo.dede.entries.find_one(id_query(entry_id)) # Many hits. Improve.
        entry = Entry(db_entry)
        if entry.is_shown:
            view_entry = ViewEntry(entry) 
            view_entries[view_entry._id] = view_entry.json_dict()
            ordered_entry_ids.append(view_entry._id)

    view_page = ViewPage(page)
    view_page.entries = view_entries
    view_page.ordered_entry_ids = ordered_entry_ids
    return view_page.json_dict()


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
    return json.dumps(tags)


# Images
@app.route('/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata():
    db_metadata = mongo.dede.image_metadata.find_one(id_query(id))
    return json.dumps(db_metadata)

@app.route('/get/image/<id>', methods = ['GET'])
def get_image(id):
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')


def id_query(id):
    return {'_id': id}


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "debug":
        app.run(debug=True, port=80)
    else:
        app.run()


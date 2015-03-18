# Clean up imports
from flask import Flask, send_file, request
from werkzeug.contrib.fixers import ProxyFix
from pymongo import MongoClient

import json
import os
import sys
import gridfs
import urllib, cStringIO

from entities.page import Page
from entities.view_page import ViewPage
from entities.entry import Entry
from entities.view_entry import ViewEntry

# Caching note:
# - Basically everything below should be cached. In its Python object form.
#   Cache:
#       * page ids
#       * page names
#       * all page views
# - The cache could never expire (maybe like every 2-3 hours, but it should be invalidated when edits are made.


mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.dede_images)
dede_view_app = Flask(__name__)
dede_view_app.wsgi_app = ProxyFix(dede_view_app.wsgi_app)


# Delivering HTML
@dede_view_app.route("/")
def hello():
    return send_file('static/view-index.html')

@dede_view_app.route('/get/pageIdsAndNames', methods = ['GET'])
def get_page_ids_and_names():
    db_pages = mongo.dede.pages.find()
    pages = [ Page(db_page) for db_page in db_pages ]
    sorted_pages = sorted(pages, key=lambda k: k.creation_date)
    # Ah, once I too used dict comprehensions.
    # ids_and_names = { page._id: page.name for page in sorted_pages if page.is_shown }
    ids_and_names = [ {'id': page._id, 'name': page.name} for page in sorted_pages if page.is_shown ] # cache
    print json.dumps(ids_and_names)
    return json.dumps(ids_and_names)

@dede_view_app.route('/get/page/<page_id>', methods = ['GET'])
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


@dede_view_app.route('/get/entry/<entry_id>', methods = ['GET'])
def get_entry(entry_id):
    raw_entry = mongo.dede.entries.find_one({'name': entry_name}) # Create an index on "name"?
    if raw_entry is not None:
        return json.dumps(raw_entry)
    else:
        return json.dumps({});

@dede_view_app.route('/get/elementTypes', methods = ['GET'])
def get_element_types():
    types = ["title", "text", "image"] # These are hard coded in markup. So, that's just great.
    return json.dumps(types)


# Tags
@dede_view_app.route('/get/tags', methods = ['GET'])
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
@dede_view_app.route('/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata():
    print "id:{0}, query: {1}".format(id, id_query(id))
    db_metadata = mongo.dede.image_metadata.find_one(id_query(id))
    print "db_metadata:"
    print db_metadata
    return json.dumps(db_metadata)

@dede_view_app.route('/get/image/<id>', methods = ['GET'])
def get_image(id):
    print "getting image by id {0}".format(id)
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')


def id_query(id):
    return {'_id': id}


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "debug":
        dede_view_app.run(debug=True, port=80)
    else:
        dede_view_app.run()

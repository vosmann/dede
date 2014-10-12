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

# from flask import Flask, request, redirect, url_for
from flask import Flask, send_file, request
from werkzeug import secure_filename
from pymongo import MongoClient
from time import strftime
from pprint import pprint

import json
import jsonpickle
import os
import gridfs

from utils.faker import create_fakes
from entities.page import Page
from entities.entry import Entry, extract_page_name


ALLOWED_EXTENSIONS = set(['svg', 'png', 'jpg', 'jpeg', 'gif'])


mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.images)
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


# Images
# Note: Could switch to "Flask-Uploads" at some point.
# Note: flask can also use directories on the filesystem for file storage.
@app.route('/edit/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata(): # TODO
    image_metadata = {
            '_id': 'img1.jpg',
            'width': '500',
            'height': '500',
            'size': '56'
    }
    return image_metadata

@app.route('/edit/get/image/metadata/all', methods = ['GET'])
def get_all_images_metadata(): # TODO
    all_images_metadata = [
        {
            '_id': 'img1.jpg',
            'width': '500',
            'height': '500',
            'size': '56'
        },
        {
            '_id': 'zezanje1.jpg',
            'width': '400',
            'height': '40',
            'size': '100'
        }
    ]
    return json.dumps(all_images_metadata)

@app.route('/edit/get/image/<id>', methods = ['GET'])
def get_image(id): # TODO
    print "getting image by id {0}".format(id)
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')

@app.route('/edit/store/image', methods = ['POST'])
def store_image():
    print "In method: /edit/store/image !"
    if request.method == 'POST':
        file = request.files['file']
        if file and is_file_extension_allowed(file.filename):
            filename = secure_filename(file.filename)
            print "About to store!"
            image_gridfs.put(file, _id=filename)
            mongo.dede.image_metadata.insert(generate_image_metadata(file))
            return "ok"
    abort(400) # bad request

@app.route('/edit/delete/image/<id>', methods = ['POST'])
def delete_image():
    # TODO delete by id
    return "ok"



def is_file_extension_allowed(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def now():
    return strftime("%Y-%m-%d %H:%M:%S")

def id_query_from_obj(json):
    return {'_id': json['_id']}

def id_query(id):
    return {'_id': id}

def name_query(name):
    return {'name': name}

def generate_image_metadata(image):
    return {
        '_id': image.filename,
        'width': '11',
        'height': '110',
        'size': '1100'
    }




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


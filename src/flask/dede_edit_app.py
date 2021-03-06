from flask import Flask, send_file, request, redirect, url_for
from flask.ext.login import LoginManager, login_user, fresh_login_required, current_user
from werkzeug.contrib.fixers import ProxyFix
from werkzeug import secure_filename
from pymongo import MongoClient
from time import strftime
from pprint import pprint
from PIL import Image

import json
import sys
import os
import gridfs
import urllib, cStringIO
import traceback

from entities.page import Page
from entities.entry import Entry, extract_page_name
from entities.user import User
from datetime import timedelta


ALLOWED_EXTENSIONS = set(['svg', 'png', 'jpg', 'jpeg', 'gif'])

mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.dede_images)

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

app.server_name = "localhost"
app.secret_key = '\xa2\xec\xe7C\xc5\x8b\xd5\x97\xa7\xcf\xb0\x97\xfc\xc9\xf7\xe9\x8b\x0c\x8ch?\xdb\x1f\x1b' # Example (encrypts session cookies).
app.session_cookie_name = "ed_session"
app.config["SESSION_COOKIE_SECURE"] = False # Set to True when using HTTPS.
app.permanent_session_lifetime = timedelta(hours=2)

login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.init_app(app)
login_manager.login_view = "login"


@app.route("/edit")
@fresh_login_required
def edit():
    print "Serving edit-index.html."
    return send_file('static/edit-index.html')

@app.route("/login", methods=['GET', 'POST'])
def login():
    print "Attempting login."
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = get_user_by_id(username)

        if user is not None:
            ok = user.login(username, password)
            if ok:
                login_user(user) 
                try:
                    url = url_for('edit', _external=True) # _scheme="https"
                    print "Login succeeded."
                    return redirect(url, code=302)
                except:
                    exc_type, exc_value, exc_traceback = sys.exc_info()
                    lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
                    print ''.join('!' + line for line in lines)
            else:
                print "Login failed."
    return send_file('static/partials/login.html')

def get_user_by_id(username):
    db_user = mongo.dede.users.find_one(id_query(username))
    if db_user is not None:
        user = User(db_user['id'], db_user['password_hash'])
        return user
    else:
        return None


# Loads a User from DB using the user_id stored in the session. The User is
# loaded to check if he's still active etc.
@login_manager.user_loader
def load_user(username):
    return get_user_by_id(username)

# Page
@app.route('/edit/store/page', methods = ['POST'])
@fresh_login_required
def store_page():

    incoming_json = request.get_json() # dict
    incoming_page = Page(incoming_json)
    incoming_page.modification_date = now()

    db_page = mongo.dede.pages.find_one(id_query_from_obj(incoming_json))

    if db_page is None:
        incoming_page.creation_date = now()
        mongo.dede.pages.insert(incoming_page.json_dict())
    else:
        mongo.dede.pages.update(id_query_from_obj(incoming_json), incoming_page.json_dict())
    return 'ok'

@app.route('/edit/delete/page', methods = ['POST'])
@fresh_login_required
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


# Entry
@app.route('/edit/store/entry', methods = ['POST'])
@fresh_login_required
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
        print "Page {0} was not found. Not updating page entries".format(page_name)
    
    return 'ok'

@app.route('/edit/delete/entry', methods = ['POST'])
@fresh_login_required
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
            db_entry = mongo.dede.entries.find_one(id_query(entry_id)) # Cry on every find.
            if db_entry is not None:
                entry = Entry(db_entry)
                entry_names.append(entry.name)
    else:
        print "Page {0} was not found.".format(page_name)

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
@app.route('/edit/store/tag', methods = ['POST'])
@fresh_login_required
def store_tag():
    incoming_json = request.get_json() # dict

    db_tag = mongo.dede.tags.find_one(id_query_from_obj(incoming_json))
    if db_tag is None:
        mongo.dede.tags.insert(incoming_json)
    else:
        mongo.dede.tags.update(id_query_from_obj(incoming_json), incoming_json)
    return "ok"

@app.route('/edit/get/tags', methods = ['GET'])
def get_tags():
    tags = []
    db_tags = mongo.dede.tags.find()
    for db_tag in db_tags:
        tags.append(db_tag)
    return json.dumps(tags)


# Images
@app.route('/edit/get/image/metadata/<id>', methods = ['GET'])
def get_image_metadata():
    db_metadata = mongo.dede.image_metadata.find_one(id_query(id))
    return json.dumps(db_metadata)

@app.route('/edit/get/image/metadata/all', methods = ['GET'])
def get_all_images_metadata():
    all_metadata = []
    all_db_metadata = mongo.dede.image_metadata.find()
    for db_metadata in all_db_metadata:
        all_metadata.append(db_metadata)

    return json.dumps(all_metadata)

@app.route('/edit/get/image/<id>', methods = ['GET'])
def get_image(id):
    return send_file(image_gridfs.get(id), mimetype='image/jpeg')

@app.route('/edit/store/image', methods = ['POST'])
@fresh_login_required
def store_image():
    if request.method == 'POST':
        file = request.files['file']
        if file and is_file_extension_allowed(file.filename):
            filename = secure_filename(file.filename)
            c_string_io = cStringIO.StringIO(file.read()) # copy

            pos = c_string_io.tell()
            image_gridfs.put(c_string_io, _id=filename)
            c_string_io.seek(pos)  # back to original position
            image_metadata = extract_image_metadata(filename, c_string_io)
            mongo.dede.image_metadata.insert(image_metadata)
            return "ok"
    abort(400) # bad request

@app.route('/edit/delete/image/<id>', methods = ['POST'])
@fresh_login_required
def delete_image(id):
    mongo.dede.image_metadata.remove(id_query(id))
    image_gridfs.delete(id)
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

def extract_image_metadata(name, file_obj):
    pos = file_obj.tell()
    image = Image.open(file_obj)
    file_obj.seek(pos)  # back to original position

    (width, height) = image.size
    size = get_filesize(file_obj)
    print "Extracted width: {0}, height: {1}, size: {2}".format(width, height, size)
    return {
        '_id': name,
        'width': width,
        'height': height,
        'size': size
    }

def get_filesize(file_obj): # Not crazily efficient.
    size = 0
    try:
        pos = file_obj.tell()
        file_obj.seek(0, 2)  #seek to end
        size = file_obj.tell()
        file_obj.seek(pos)  # back to original position
    except (AttributeError, IOError):
        pass
    if size == 0:
        print "File size could not be determined. Returning zero."

    return size


def now():
    return strftime("%Y-%m-%d %H:%M:%S")

def id_query_from_obj(json):
    return {'_id': json['_id']}

def id_query(id):
    return {'_id': id}

def name_query(name):
    return {'name': name}


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "debug":
        app.run(debug=True, port=5000)
        # from OpenSSL import SSL # for local https
        # app.run(debug=True, port=5000, ssl_context=context)
        # context = SSL.Context(SSL.SSLv23_METHOD)
        # context.use_privatekey_file('yourserver.key')
        # context.use_certificate_file('yourserver.crt')
    else:
        app.run()


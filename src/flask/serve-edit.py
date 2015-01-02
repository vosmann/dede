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
from flask import Flask, send_file, request, redirect, url_for
from flask.ext.login import LoginManager, login_user, login_required, fresh_login_required, current_user
from werkzeug import secure_filename
from pymongo import MongoClient
from time import strftime
from pprint import pprint
from PIL import Image

import json
import os
import gridfs
import urllib, cStringIO

from utils.faker import create_fakes
from entities.page import Page
from entities.entry import Entry, extract_page_name
from entities.user import User


ALLOWED_EXTENSIONS = set(['svg', 'png', 'jpg', 'jpeg', 'gif'])


mongo = MongoClient() # Mongo DB client shared among request contexts.
image_gridfs = gridfs.GridFS(mongo.dede_images)
app = Flask(__name__)

# MASSIVE TODO: redirect to /login from everywhere (if there is no session/login.

# the secret key is what the (session) cookies are encrypted with.
app.secret_key = '\xa2\xec\xe7C\xc5\x8b\xd5\x97\xa7\xcf\xb0\x97\xfc\xc9\xf7\xe9\x8b\x0c\x8ch?\xdb\x1f\x1b'

# app.config['SERVER_NAME'] = 'localhost:5000'
# app.config['REMEMBER_COOKIE_NAME'] = 'ed' 

login_manager = LoginManager()
login_manager.init_app(app)

editor_user = None

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # TODO sanitize inputs?
        username = request.form['username']
        password = request.form['password']

        user = User()
        print "1: created user"
        print user.__dict__
        ok = user.login(username, password)
        print "2: attempted to log him in"
        print user.__dict__
        if ok:
            print "3: logging him into flask-login"
            print user.__dict__
            login_user(user) # remember=True
            print "3b: current_user:"
            print current_user.__dict__

            editor_user = current_user # oh glob
            
            # url = 'localhost:5000' + url_for('edit')
            url = 'www.google.de'
            print "4: redirecting to:"
            print url
            redirect(url, code = 307)
            # redirect('/edit') # return redirect(request.args.get("next") or url_for("index"))
        else:
            print "3: login failed"
    return send_file('static/partials/login.html')

# Loads a User (from some DB) using the user_id stored in the session. The User is loaded just to check
# if he's still active etc.
@login_manager.user_loader
def load_user(userid):
    # Tu smo. Treba samo izbaviti/napraviti nekakvog Usera po id-u i to poslat nazad. #almostthere
    print "in login_manager.user_loader; about to get User object."
    # return User.get_editor()
    return editor_user 


# Delivering HTML
@app.route("/edit")
@login_required
def edit():
    print "/edit was opened. sending the one-page-app edit-index.html"
    return send_file('static/edit-index.html')

# REST methods for Page
@app.route('/edit/store/page', methods = ['POST'])
@login_required
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
@login_required
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
@login_required
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

    
    return 'ok'

@app.route('/edit/delete/entry', methods = ['POST'])
@login_required
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


# Tags
# TODO Actually, should keep _id *and* display name so that the latter can be changed.
@app.route('/edit/store/tag', methods = ['POST'])
@login_required
def store_tag():
    incoming_json = request.get_json() # dict
    print "tag:"
    print incoming_json 


    db_tag = mongo.dede.tags.find_one(id_query_from_obj(incoming_json))
    if db_tag is None:
        print "didn't exist, inserting."
        mongo.dede.tags.insert(incoming_json)
    else:
        print "existed already, updating."
        mongo.dede.tags.update(id_query_from_obj(incoming_json), incoming_json)
    return "ok"

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
# Note: Could switch to "Flask-Uploads" at some point.
# Note: flask can also use directories on the filesystem for file storage.
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

@app.route('/edit/store/image', methods = ['POST'])
@login_required
def store_image():
    print "In method: /edit/store/image !"
    if request.method == 'POST':
        file = request.files['file']
        if file and is_file_extension_allowed(file.filename):
            filename = secure_filename(file.filename)
            print "About to store file {0}".format(file.filename)
            print file
            c_string_io = cStringIO.StringIO(file.read()) # copy
            print c_string_io

            pos = c_string_io.tell()
            image_gridfs.put(c_string_io, _id=filename)
            c_string_io.seek(pos)  # back to original position
            image_metadata = extract_image_metadata(filename, c_string_io)
            mongo.dede.image_metadata.insert(image_metadata)
            return "ok"
    abort(400) # bad request

@app.route('/edit/delete/image/<id>', methods = ['POST'])
@login_required
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
    print "extracted width: {0}, height: {1}, size: {2}".format(width, height, size)
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
        print "got size from seek&tell"
    except (AttributeError, IOError):
        pass
    if size == 0:
        print "size could not be determined. returning zero."

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
    app.run(debug=True, host='0.0.0.0')


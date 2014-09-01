from flask import Flask, send_file, request
from pymongo import MongoClient

import json
import os

from utils.faker import create_fakes
from entities.page import Page

shared_mongo_client = MongoClient()


app = Flask(__name__)

# Have methods returning: - names of all pages
#                         - names (titles) of all entries. so that not the whole objects have to be retrieved

# Idea on how to load the site into the user's browser:
#  . The Angular app can simply retrieve all pages with all their entries and elements
#    up front. Just load everything.
#  . Then load images only when necessary.
#
# Different idea:
#  . Load everything on demand. Have many, many small requests going from the Angular app to the server.
#
# It would be awesome if adding pages like "projects" or "news stories" on the edit page would generate
# the AngularJS controllers automatically.

# Maybe have a special (only when authenticated) interface that serves some page or entry even if it is hidden.
# So that the user can preview a new page or entry before he really shows it on the live site.

# Have API methods that return a just the shallow JSON of a requested page and one that also returns
# all the entries contained on the page as fields in the object, or in a separate entries' list of entry objects.


# Delivering HTML
@app.route("/")
def hello():
    return send_file('static/view-index.html')

@app.route("/edit")
def edit():
    return send_file('static/edit-index.html')


# REST methods
@app.route('/edit/store/page', methods = ['POST'])
def storePage():
    print "about to store a page!"
    print request.get_json()
    return 'ok'

@app.route('/edit/store/entry', methods = ['POST'])
def storeEntry():
    print "about to store an entry!"
    print request.get_json()
    return 'ok'



# Old 
@app.route("/get-pages") 
def get_projects():
    print "call to /get-pages"
    with app.app_context():
        # Or have a parameter that gives the id or name or nothing (meaning: fetch all)
        # Don't use _id. Use name everywhere.
        pages = []
        for page in shared_mongo_client.dede.pages.find():
            pages.append(page)
        return json.dumps(pages)

@app.route("/get-entries")
def get_news():
    # Or have a parameter that gives the id or name or nothing (meaning: fetch all)
    with app.app_context():
        news = []
        for news_story in shared_mongo_client.dede.news.find():
            news.append(news_story)
        return json.dumps(news)

@app.route("/get-element")
def get_tags():
    print "call to /get-tags"
    with app.app_context():
        tags = []
        for tag in shared_mongo_client.dede.tags.find():
            tags.append(tag)
        return json.dumps(tags)

@app.route("/get-about")
def get_about():
    with app.app_context():
        about = shared_mongo_client.dede.about.find_one({"_id": 0})
        return json.dumps(about)

@app.route("/get-contact")
def get_contact():
    with app.app_context():
        contact = shared_mongo_client.dede.contact.find_one({"_id": 0})
        return json.dumps(contact)

# save new data
# @app.route("/edit/save-page")
# def save_project():
#     return "save project"

if __name__ == "__main__":
    #create_fakes()
    app.run(debug=True)


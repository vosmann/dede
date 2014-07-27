from flask import Flask, send_file
from pymongo import MongoClient
from project import Project
from faker import create_fakes
import json
import os

shared_mongo_client = MongoClient()

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = DIR + "/templates" # Not using
RESOURCES_DIR = DIR + "/resources"
print TEMPLATES_DIR
print RESOURCES_DIR

app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=RESOURCES_DIR)

# It would be awesome if adding pages like "projects" or "news stories on the edit page would generate
# the AngularJS controllers automatically.

@app.route("/")
def hello():
    return send_file('resources/templates/index.html')

@app.route("/edit")
def edit():
    return send_file('resources/templates/edit.html')

@app.route("/get-projects")
def get_projects():
    print "call to /get-projects"
    with app.app_context():
        projects = []
        for project in shared_mongo_client.dede.projects.find():
            projects.append(project)
        return json.dumps(projects)

@app.route("/get-news")
def get_news():
    with app.app_context():
        news = []
        for news_story in shared_mongo_client.dede.news.find():
            news.append(news_story)
        return json.dumps(news)

@app.route("/get-tags")
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

if __name__ == "__main__":
    #create_fakes()
    app.run(debug=True)


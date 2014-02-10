from flask import Flask, send_file
from pymongo import MongoClient
from project import Project
from faker import create_fakes, get_date
import json
import os

shared_mongo_client = MongoClient()

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES_DIR = DIR + "/templates" # Not using
RESOURCES_DIR = DIR + "/resources"
print TEMPLATES_DIR
print RESOURCES_DIR

#app = Flask(__name__)
app = Flask(__name__, template_folder=TEMPLATES_DIR, static_folder=RESOURCES_DIR)

@app.route("/")
def hello():
    return send_file('resources/templates/index.html')

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


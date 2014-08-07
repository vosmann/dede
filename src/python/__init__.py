from flask import Flask, make_response
from pymongo import MongoClient
from project import Project

shared_mongo_client = MongoClient()
app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)

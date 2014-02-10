import json
import datetime
from project import Project
from news import News
from about import About
from contact import Contact
from pymongo import MongoClient

def get_date():
    return datetime.datetime.utcnow().isoformat().split("T")[0]

def create_fakes():
    print "creating fakes"
    
    mongo_client = MongoClient()
    dede_db = mongo_client.dede

    projects = dede_db.projects
    proj0 = Project(0, "project0", get_date(), "graphic design", "this was my first project", [0], 0, 0, True)
    proj1 = Project(1, "project1", get_date(), "corporate identity", "then came the second", [0], 0, 0, True)
    projects.insert(proj0.__dict__)
    projects.insert(proj1.__dict__)

    news = dede_db.news 
    news0 = News(0, "first news story", get_date(), "bla bla bla", [0], 0)
    news1 = News(1, "news story nr 2", get_date(), "lol lol lol", [0], 0)
    news.insert(news0.__dict__)
    news.insert(news1.__dict__)

    #images = dede_db.images
    #images.insert(image1)

    about = dede_db.about
    about0 = About("dede is a portfolio web site")
    about.insert(about0.__dict__)

    contact = dede_db.contact
    contact0 = Contact( [("dede@dede.com", "dede"), ("facebook.com/dede", "facebook")] )
    contact.insert(contact0.__dict__)


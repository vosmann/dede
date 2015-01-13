# pip
sudo apt-get install python-pip python-dev build-essential


# mongo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org

#
sudo pip install Flask
sudo pip install flask-login
sudo pip install pymongo
sudo pip install Pillow

# sudo pip install mmh3 # murmur hash 3


# connect to the AWS t2.micro instance
ssh -i ~/.ssh/vjeko-key-pair.pem ec2-user@ec2-54-76-149-171.eu-west-1.compute.amazonaws.com


# TODO
# 1. write a script that will ship the current code on master.
#    1a. it could also perhaps change some settings from dev (includes debug info) to production settings.


# setting up a gunicorn (standalone wsgi) + supervisor production server
sudo apt-get install supervisor gunicorn authbind


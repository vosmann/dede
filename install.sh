# pip
sudo apt-get install python-pip python-dev build-essential

# flask
sudo pip install Flask
sudo pip install mimerender # don't use flask-mimerender?

# mongo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get install mongodb-10gen
sudo pip install pymongo==2.6.3

# copy dede

sudo pip install -U jsonpickle

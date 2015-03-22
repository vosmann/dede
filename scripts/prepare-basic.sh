# basic: developing, running
sudo apt-get install python-pip python-dev build-essential
sudo pip install Flask flask-login pymongo Pillow

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo locale-gen de_DE.UTF-8 # Or en_US.UTF-8 ?
sudo dpkg-reconfigure locales # Perhaps necessary


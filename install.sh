# NOTES ON AUTOMATING DEPLOYMENT
# I should probably make a nice docker image with ubuntu, https set up, supervisor & gunicorn installed,
# python, mongo... and then maybe dynamically append an image that would just copy some 
# private keys/certificates
# Although... recommended procedure with deploying new code? Add it to the very bottom of the Docker layers?
# Use nginx as a proxy for gunicorn

# minify and obfuscate code. use:
#   - browserify.js,
#   - require.js or
#   - webpack

# Set up non-root users for supervisor, gunicorn, mongo, etc.

# MANUAL DEPLOYMENT
# pip
sudo apt-get install python-pip python-dev build-essential
# python stuff: flask & co.
sudo pip install Flask flask-login pymongo Pillow
# sudo pip install mmh3 # murmur hash 3 # Don't need this actually, in the current impl at least.
# mongo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
# handy
sudo apt-get install tree htop ack-grep
# maybe
echo -e 'set number\nset shiftwidth=4\nset tabstop=4\nset expandtab\nset softtabstop=4\nset shiftround\nset autoindent\n' >> ~/.vimrc
echo -e 'alias l='ls -hla --group-directories-first'\nalias ack='ack-grep'\nset -o vi\n' >> ~/.bashrc

# connect to the AWS t2.micro instance
ssh -i ~/.ssh/vjeko-key-pair.pem ubuntu@54.154.91.170 # baubau
ssh -i ~/.ssh/vjeko-key-pair.pem ubuntu@54.93.102.116 # dede-test

# TODO
# 1. write a script that will ship the current code on master.
#    1a. it could also perhaps change some settings from dev (includes debug info) to production settings.

# setting up a gunicorn (standalone wsgi) + supervisor production server
sudo apt-get install supervisor gunicorn authbind

# Starting gunicorn on HTTPS
gunicorn -w3 --certfile=server.crt --keyfile=server.key test:app



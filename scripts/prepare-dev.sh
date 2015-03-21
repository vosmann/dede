# developing, running
sudo apt-get install python-pip python-dev build-essential
sudo pip install Flask flask-login pymongo Pillow

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
sudo locale-gen de_DE.UTF-8 # Or en_US.UTF-8 ?
sudo dpkg-reconfigure locales # Perhaps necessary


# building, deploying
sudo pip install pyminifier
sudo apt-get install openssl
openssl req -x509 -sha256 -newkey rsa:2048 -nodes -keyout dede-test-https-key.pem -out dede-test-https-cert.pem -days 365
# "-nodes" Makes a certificate without a password phrase.


# server shell+editor configuration
echo -e 'set number\nset shiftwidth=4\nset tabstop=4\nset expandtab\nset softtabstop=4\nset shiftround\nset autoindent\n' >> ~/.vimrc
echo -e 'set -o vi\n' >> ~/.bashrc # 'alias l='ls -hla --group-directories-first' 'alias ack='ack-grep'' 
sudo apt-get install tree htop ack-grep

# server
sudo apt-get install supervisor authbind gunicorn nginx










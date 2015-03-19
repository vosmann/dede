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


# ON DEVELOPMENT/DEPLOYING MACHINE:
#git clone https://github.com/liftoff/pyminifier.git ~/p/pyminifier/
sudo pip install pyminifier

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
sudo locale-gen de_DE.UTF-8 # or something like en_US.UTF-8
sudo dpkg-reconfigure locales # perhaps this will be necessary too
# mongodump
# mongorestore dir-with-dump/

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
./ship-dede-test.sh 54.93.120.129
scp -i ~/.ssh/dede-test.pem refresh.sh ubuntu@54.93.120.129:/home/ubuntu/dede/

# setting up a gunicorn (standalone wsgi) + supervisor production server
sudo apt-get install supervisor gunicorn authbind nginx

# trying to get a newer gunicorn
sudo apt-get install python-software-properties
sudo apt-add-repository ppa:gunicorn/ppa
sudo apt-get update
sudo apt-get install gunicorn

# do
sudo vi /etc/apt/sources.list
# and add these to get new gunicorn
deb http://ppa.launchpad.net/gunicorn/ppa/ubuntu trusty main
deb-src http://ppa.launchpad.net/gunicorn/ppa/ubuntu trusty main
# and then do to install
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 5370FF2A
sudo apt-get update
sudo apt-get install gunicorn


# Starting gunicorn on HTTPS
gunicorn -w3 --certfile=server.crt --keyfile=server.key test:app

# Setting up HTTPS
sudo apt-get install openssl
openssl req -x509 -sha256 -newkey rsa:2048 -nodes -keyout dede-test-https-key.pem -out dede-test-https-cert.pem -days 365
# -nodes makes a certificate without a password phrase.
# openssl genrsa 2048 > private-key.pem # doesn't make a certificate











# TODO delete below

# failing to open https://54.93.120.129/edit in firefox:
ubuntu@ip-172-31-31-129:~/dede/src/flask$ sudo gunicorn  -c /home/ubuntu/dede/config/gunicorn_dede_edit_app.conf dede_edit_app:dede_edit_app --certfile=/home/ubuntu/ssl/dede-test-https-cert.pem --keyfile=/home/ubuntu/ssl/dede-test-https-key.pem
2015-03-01 18:15:35 [32386] [INFO] Starting gunicorn 17.5
2015-03-01 18:15:35 [32386] [INFO] Listening at: https://0.0.0.0:443 (32386)
2015-03-01 18:15:35 [32386] [INFO] Using worker: sync
2015-03-01 18:15:35 [32391] [INFO] Booting worker with pid: 32391
Enter PEM pass phrase:
2015-03-01 18:16:12 [32391] [ERROR] Error handling request
Traceback (most recent call last):
File "/usr/lib/python2.7/dist-packages/gunicorn/workers/sync.py", line 87, in handle
req = six.next(parser)
File "/usr/lib/python2.7/dist-packages/gunicorn/http/parser.py", line 39, in __next__
self.mesg = self.mesg_class(self.cfg, self.unreader, self.req_count)
File "/usr/lib/python2.7/dist-packages/gunicorn/http/message.py", line 152, in __init__
super(Request, self).__init__(cfg, unreader)
File "/usr/lib/python2.7/dist-packages/gunicorn/http/message.py", line 49, in __init__
unused = self.parse(self.unreader)
File "/usr/lib/python2.7/dist-packages/gunicorn/http/message.py", line 164, in parse
self.get_data(unreader, buf, stop=True)
File "/usr/lib/python2.7/dist-packages/gunicorn/http/message.py", line 155, in get_data
data = unreader.read()
File "/usr/lib/python2.7/dist-packages/gunicorn/http/unreader.py", line 38, in read
d = self.chunk()
File "/usr/lib/python2.7/dist-packages/gunicorn/http/unreader.py", line 65, in chunk
return self.sock.recv(self.mxchunk)
File "/usr/lib/python2.7/ssl.py", line 341, in recv
return self.read(buflen)
File "/usr/lib/python2.7/ssl.py", line 260, in read
return self._sslobj.read(len)
SSLError: [Errno 1] _ssl.c:1429: error:14094418:SSL routines:SSL3_READ_BYTES:tlsv1 alert unknown ca


Enter PEM pass phrase:
2015-03-01 18:22:21 [32391] [ERROR] Error handling request
Traceback (most recent call last):
File "/usr/lib/python2.7/dist-packages/gunicorn/workers/sync.py", line 84, in handle
**self.cfg.ssl_options)
File "/usr/lib/python2.7/ssl.py", line 487, in wrap_socket
ciphers=ciphers)
File "/usr/lib/python2.7/ssl.py", line 241, in __init__
ciphers)
SSLError: [Errno 336265225] _ssl.c:355: error:140B0009:SSL routines:SSL_CTX_use_PrivateKey_file:PEM lib


Enter PEM pass phrase:
2015-03-01 18:22:30 [32391] [ERROR] Error handling request
Traceback (most recent call last):
File "/usr/lib/python2.7/dist-packages/gunicorn/workers/sync.py", line 84, in handle
**self.cfg.ssl_options)
File "/usr/lib/python2.7/ssl.py", line 487, in wrap_socket
ciphers=ciphers)
File "/usr/lib/python2.7/ssl.py", line 241, in __init__
ciphers)
SSLError: [Errno 336265225] _ssl.c:355: error:140B0009:SSL routines:SSL_CTX_use_PrivateKey_file:PEM lib
Enter PEM pass phrase:
2015-03-01 18:22:32 [32391] [ERROR] Error handling request
Traceback (most recent call last):
File "/usr/lib/python2.7/dist-packages/gunicorn/workers/sync.py", line 84, in handle
**self.cfg.ssl_options)
File "/usr/lib/python2.7/ssl.py", line 487, in wrap_socket
ciphers=ciphers)
File "/usr/lib/python2.7/ssl.py", line 241, in __init__
ciphers)
SSLError: [Errno 336265225] _ssl.c:355: error:140B0009:SSL routines:SSL_CTX_use_PrivateKey_file:PEM lib



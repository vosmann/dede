source prepare-basic.sh

# shell+editor configuration
echo -e 'set number\nset shiftwidth=4\nset tabstop=4\nset expandtab\nset softtabstop=4\nset shiftround\nset autoindent\n' >> ~/.vimrc
echo -e 'set -o vi\n' >> ~/.bashrc # 'alias l='ls -hla --group-directories-first' 'alias ack='ack-grep'' 
sudo apt-get install -y tree htop ack-grep

# servers
sudo apt-get install -y supervisor authbind gunicorn nginx

# https keys
sudo apt-get install openssl
openssl req -x509 -sha256 -newkey rsa:2048 -nodes -keyout dede-test-https-key.pem -out dede-test-https-cert.pem -days 365
# "-nodes" Makes a certificate without a password phrase.


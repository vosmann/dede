# https keys
sudo apt-get install -y openssl
openssl req -x509 -sha256 -newkey rsa:1024 -nodes -keyout ../.local-https-key -out ../.local-https-cert -days 365
# "-nodes" Makes a certificate without a password phrase.


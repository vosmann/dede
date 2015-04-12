source dede.conf

echo "Running prepare-server."
ssh -i $SSH_KEY_PATH $USER@$HOST < prepare-basic.sh

# shell+editor configuration
ssh -i $SSH_KEY_PATH $USER@$HOST "echo -e 'set number\nset shiftwidth=4\nset tabstop=4\nset expandtab\nset softtabstop=4\nset shiftround\nset autoindent\n' >> ~/.vimrc"
ssh -i $SSH_KEY_PATH $USER@$HOST "echo -e 'set -o vi\n' >> ~/.bashrc"
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo apt-get install -y tree htop ack-grep"

# servers
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo apt-get install -y supervisor authbind gunicorn nginx"

# https keys
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo apt-get install -y openssl"
ssh -i $SSH_KEY_PATH $USER@$HOST "openssl req -x509 -sha256 -newkey rsa:2048 -nodes -keyout $HTTPS_KEY_PATH -out $HTTPS_CERT_PATH -days 365"
# "-nodes" Makes a certificate without a password phrase.
echo "Finished prepare-server."


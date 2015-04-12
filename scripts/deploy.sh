# Configuration
source dede.conf
echo "Deploying Dede to $HOST."

# Teeny bit of safety
echo "Enter 'ok' to continue."
read USER_INPUT
if [ "$USER_INPUT" != "ok" ]; then
    echo "Deploy cancelled."
    exit 1
fi;

# Shoot up the config
scp -i $SSH_KEY_PATH ../config/nginx.conf $USER@$HOST:/tmp/nginx.conf
scp -i $SSH_KEY_PATH ../config/nginx-edit $USER@$HOST:/tmp/nginx-edit
scp -i $SSH_KEY_PATH ../config/nginx-view $USER@$HOST:/tmp/nginx-view
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx.conf $NGINX_GLOBAL_CONF"
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx-edit $NGINX_EDIT_CONF"
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx-view $NGINX_VIEW_CONF"

# Make remote server directory
ssh -i $SSH_KEY_PATH $USER@$HOST "mkdir -p $DEDE_LOCATION" # Because single quotes don't expand variables.

# Shoot up the Dede archive
scp -i $SSH_KEY_PATH ../target/dede.tar.gz $USER@$HOST:$DEDE_LOCATION/dede.tar.gz

# Explode the Dede archive on server and restart Gunicorn & Nginx
# A copy of the previous version would be good for rollback purposes.
# ssh $USER@$HOST 'bash -s' < script.sh
ssh -i $SSH_KEY_PATH $USER@$HOST "tar -xvzf $DEDE_LOCATION/dede.tar.gz -C $DEDE_LOCATION"
echo "Waiting $SLEEP_TIME seconds."
sleep $SLEEP_TIME

ssh -i $SSH_KEY_PATH $USER@$HOST "sudo service gunicorn restart"
echo "Waiting $SLEEP_TIME seconds."
sleep $SLEEP_TIME

ssh -i $SSH_KEY_PATH $USER@$HOST "sudo service nginx restart"
echo "Finished deploying Dede to $HOST."


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

# Make remote server directory
ssh -i $SSH_KEY_PATH $USER@$HOST "mkdir -p $DEDE_LOCATION" # Because single quotes don't expand variables.

# Shoot up the config: Supervisor
scp -i $SSH_KEY_PATH ../config/supervisord.conf $USER@$HOST:/tmp/
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/supervisord.conf /etc/supervisord.conf"

# Shoot up the config: Gunicorn
scp -i $SSH_KEY_PATH ../config/gunicorn_dede_edit_app.conf $USER@$HOST:/home/ubuntu/server/
scp -i $SSH_KEY_PATH ../config/gunicorn_dede_view_app.conf $USER@$HOST:/home/ubuntu/server/

# Shoot up the config: Nginx
scp -i $SSH_KEY_PATH ../config/nginx.conf $USER@$HOST:/tmp/
scp -i $SSH_KEY_PATH ../config/nginx-edit $USER@$HOST:/tmp/
scp -i $SSH_KEY_PATH ../config/nginx-view $USER@$HOST:/tmp/
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx.conf /etc/nginx/nginx.conf"
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx-edit /etc/nginx/sites-available/nginx-edit"
ssh -i $SSH_KEY_PATH $USER@$HOST "sudo mv /tmp/nginx-view /etc/nginx/sites-available/nginx-view"

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


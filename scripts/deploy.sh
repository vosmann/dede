# Configuration
HOST=x.x.x.x
USER=ubuntu
NGINX_GLOBAL_CONF=/etc/nginx/nginx.conf
NGINX_EDIT_CONF=/etc/nginx/sites-available/edit-config
NGINX_VIEW_CONF=/etc/nginx/sites-available/view-config
DEDE_ARCHIVE_LOCATION=/home/$USER/dede-archived/
DEDE_LOCATION=/home/$USER/dede/
SLEEP_TIME=3

# Shoot up the config
scp ../config/nginx.conf $USER@$HOST:$NGINX_GLOBAL_CONF
scp ../config/nginx-edit $USER@$HOST:$NGINX_EDIT_CONF
scp ../config/nginx-view $USER@$HOST:$NGINX_VIEW_CONF

# Shoot up the Dede archive
scp ../target/dede.tar.gz $USER@$HOST:$DEDE_ARCHIVE_LOCATION


# Explode the Dede archive on server and restart Gunicorn & Nginx
# ssh $USER@$HOST 'bash -s' < script.sh
ssh $USER@$HOST "tar -xvzf $DEDE_ARCHIVE_LOCATION -C $DEDE_LOCATION" # Because single quotes don't expand variables.
sleep $SLEEP_TIME

ssh $USER@$HOST "sudo service gunicorn restart"
sleep $SLEEP_TIME

ssh $USER@$HOST "sudo service nginx restart"


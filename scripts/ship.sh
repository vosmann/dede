# REMOTE_HOST=$1
REMOTE_HOST=54.93.120.129

tar -czvf ship/dede.tar.gz src/flask > /dev/null

echo "uploading to $REMOTE_HOST"
scp -i ~/.ssh/dede-test.pem ship/dede.tar.gz ubuntu@$REMOTE_HOST:/home/ubuntu/dede

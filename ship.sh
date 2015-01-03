REMOTE_HOST=$1

tar -czvf ship/dede.tar.gz src/flask > /dev/null

echo "uploading to $REMOTE_HOST"
scp -i ~/.ssh/vjeko-key-pair.pem ship/dede.tar.gz ubuntu@$REMOTE_HOST:/home/ubuntu/dede
# rm ship/dede.tar.gz

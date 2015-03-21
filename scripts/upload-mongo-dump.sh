ssh -i $SSH_KEY $USER@$HOST "mongodump --out $DUMP_LOCATION/$DUMP_DIR_NAME"
ssh -i $SSH_KEY $USER@$HOST "tar -cvzf $DUMP_LOCATION/$DUMP_FILE_NAME $DUMP_LOCATION/$DUMP_DIR_NAME"
scp -i $SSH_KEY $USER@$HOST:$DUMP_LOCATION/

mongorestore dir-with-dump/

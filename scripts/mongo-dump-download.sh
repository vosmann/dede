source dede.conf

ssh -i $MONGO_SRC_SSH_KEY_PATH $USER@$MONGO_SRC_HOST "mongodump --out $DUMP_SERVER_LOCATION/$DUMP_DIR_NAME"
ssh -i $MONGO_SRC_SSH_KEY_PATH $USER@$MONGO_SRC_HOST "cd $DUMP_SERVER_LOCATION && tar -cvzf $DUMP_FILE_NAME $DUMP_DIR_NAME"

scp -i $MONGO_SRC_SSH_KEY_PATH $USER@$MONGO_SRC_HOST:$DUMP_SERVER_LOCATION/$DUMP_FILE_NAME $DUMP_LOCAL_LOCATION/$DUMP_FILE_NAME


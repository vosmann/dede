mkdir -p ../target/dede/
mkdir -p ../target/temp/python-minified

find ../src -iname *py

pyminifier --obfuscate dede_view_app.py | grep -i "#" > file
# find *.txt -exec awk 'END {print $0 "," FILENAME}' {} \;


cp --parents he/lo/you/mmm dest
DIR_NAME=dirname $FULL_PATH
FILE_NAME=basename $FULL_PATH


tar -cvzf ../target/dede.tar.gz ../dede/
rm -r ../target/temp

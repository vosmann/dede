source prepare-basic.sh

# building, deploying
sudo pip install pyminifier
sudo apt-get install npm
sudo npm install -g gulp
npm init
sudo ln -s /usr/bin/nodejs /usr/bin/node


# what is save-dev?
npm install --save-dev gulp
npm install --save-dev gulp-uglify


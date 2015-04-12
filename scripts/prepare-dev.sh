source prepare-basic.sh

# building, deploying
sudo pip install pyminifier
sudo apt-get install npm
sudo npm install -g gulp
npm init
sudo ln -s /usr/bin/nodejs /usr/bin/node


# i for install
npm i gulp --save-dev 
npm i gulp-uglify --save-dev 
npm i gulp-htmlmin --save-dev
npm i gulp-minify-css --save-dev 


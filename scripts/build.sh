#!/bin/bash
# Build an archive with Bash? Well, why not.
# Minifying Python too; for kicks.
# Attempting readability by extracting params passed into functions into local
# variables maybe isn't that readable. Perhaps better to just have global vars.
# Well, I've learned that Bash build scripts may become a bit unreadable.
# This python-minifying functinality could be extracted into a gulp plugin.
# Should do everything from Gulp. And get rid of clean.sh and build.sh.

function find_by_extension {
    local ROOT_DIR=$1
    local EXTENSION=$2
    local FULL_PATHS=$(find $ROOT_DIR -iname *.$EXTENSION)
    echo "$FULL_PATHS"
}
function process_one_py {
    local PY_FULL_PATH=$1
    local ROOT_DIR=$2/
    local TARGET_DIR=$3
    local TEMP_DIR=$4
    local PY_PATH=$(dirname $PY_FULL_PATH)
    local PY_NAME=$(basename $PY_FULL_PATH)
    local PY_RELATIVE_PATH=${PY_PATH#$ROOT_DIR} # Chop off prefix, i.e. root dir.
    echo "PY_FULL_PATH=$PY_FULL_PATH"
    pyminifier --obfuscate $PY_FULL_PATH | grep -v "#" > $TEMP_DIR/$PY_NAME
    # --parents? No thanks, got PY_RELATIVE_PATH.
    mkdir -pv $TARGET_DIR/dede/$PY_RELATIVE_PATH
    cp $TEMP_DIR/$PY_NAME $TARGET_DIR/dede/$PY_RELATIVE_PATH
    mkdir -pv $TARGET/$PY_PATH
}
function process_py {
    echo "Processing Python."
    local ROOT_DIR=$1
    local TARGET_DIR=$2
    local TEMP_DIR=$TARGET_DIR/py_temp
    mkdir -pv $TEMP_DIR
    PY_FILES=$(find_by_extension $ROOT_DIR py)
    for PY_FILE in $PY_FILES; do
        process_one_py $PY_FILE $ROOT_DIR $TARGET_DIR $TEMP_DIR
    done
    rm -rv $TEMP_DIR
}
function process_static {
    echo "Processing JS, HTML and CSS"
    gulp dede-static # See gulp.js
}

source clean.sh
echo "Building Dede."
cd ..
ROOT_DIR=$(pwd)
TARGET_DIR=$ROOT_DIR/target
# TARGET_DIR_REL=$(echo $TARGET_DIR | awk -F '/target/' '{print $2}')
echo "ROOT_DIR=$ROOT_DIR"
echo "TARGET_DIR=$TARGET_DIR"
cd scripts
rm -rv $TARGET_DIR
mkdir -pv $TARGET_DIR
process_py $ROOT_DIR $TARGET_DIR
process_static
echo "Compressing Dede to .tar.gz."
cd ../target
tar -cvzf $TARGET_DIR/dede.tar.gz dede/ 
rm -rv $TARGET_DIR/dede/
echo "Done."


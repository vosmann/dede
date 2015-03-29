#!/bin/bash
# Build an archive with Bash? Well, why not
# Attempting readability by extracting params passed into functions into local
# variables maybe isn't that readable. Perhaps better to just have global vars.

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
    pyminifier --obfuscate PY_FULL_PATH | grep -i "#" > $TEMP_DIR/$PY_NAME # Minify, for kicks
    echo "PY_FULL_PATH=$PY_FULL_PATH"
    echo "ROOT_DIR=$ROOT_DIR"
    echo "TARGET_DIR=$TARGET_DIR"
    echo "TEMP_DIR=$TEMP_DIR"
    echo "PY_PATH=$PY_PATH"
    echo "PY_NAME=$PY_NAME"
    echo "PY_RELATIVE_PATH=$PY_RELATIVE_PATH"
    echo ""
    # cp --parents PY_FULL_PATH ../target
    mkdir -pv $TARGET/$PY_PATH
}
function process_py {
    local ROOT_DIR=$1
    local TARGET_DIR=$2
    local TEMP_DIR=$TARGET_DIR/py_temp
    mkdir -pv $TEMP_DIR
    # local ROOT_SRC_DIR=$ROOT_DIR/src
    PY_FILES=$(find_by_extension $ROOT_DIR py)
    # echo "PY_FILES are =$PY_FILES"
    for PY_FILE in $PY_FILES; do
        process_one_py $PY_FILE $ROOT_DIR $TARGET_DIR $TEMP_DIR
    done
}
function process_html {
    echo "Processing HTML."
}
function process_css {
    echo "Processing CSS"
}
function process_js {
    echo "Processing JS"
}

echo "Started dede.tar.gz build."
cd ..
ROOT_DIR=$(pwd)
cd scripts
TARGET_DIR=$ROOT_DIR/target
echo "ROOT_DIR=$ROOT_DIR"
echo "TARGET_DIR=$TARGET_DIR"
rm -rv $TARGET_DIR
mkdir -pv $TARGET_DIR

process_py $ROOT_DIR $TARGET_DIR
#process_html
#process_css
#process_js
# Compression
#tar -cvzf ../target/dede.tar.gz ../dede/
#rm -rv ../target/temp



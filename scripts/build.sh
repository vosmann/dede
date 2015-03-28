#!/bin/bash

function find_by_extension {
    local EXTENSION=$1
    local FULL_PATHS=$(find ../.. -iname *.$EXTENSION)
    echo "$FULL_PATHS"
}
# Python: minify, for kicks
function process_one_py {
    PY_FULL_PATH=$1
    PY_PATH=$(dirname $PY_FULL_PATH)
    PY_NAME=$(basename $PY_FULL_PATH)
    echo "Here's one path in a function: $PY_PATH"
    echo "and one name in a function: $PY_NAME"
    echo ""
    # pyminifier --obfuscate dede_view_app.py | grep -i "#" > file
    # find *.txt -exec awk 'END {print $0 "," FILENAME}' {} \;
    #cp --parents he/lo/you/mmm dest
}
function process_py {
    PY_FILES=$(find_by_extension py)
    echo "PY_FILES are =$PY_FILES"
    TEMP_LOCATION=../target/temp/python-minified
    mkdir -p $TEMP_LOCATION
    for PY_FILE in $PY_FILES; do
        process_one_py $PY_FILE
    done
}
# HTML
function process_html {
}

# CSS and similar
function process_css {
}

# JS: not using a fully-blown JS build process



# Build .tar.gz
rm -r ../target
mkdir -p ../target/dede/

$(process_py)
#$(process_html)
#$(process_css)
#$(process_js)

# Compression
#tar -cvzf ../target/dede.tar.gz ../dede/
#rm -r ../target/temp

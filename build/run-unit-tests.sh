#!/bin/bash

# Copyright (c) 2021 Red Hat, Inc.
# Copyright Contributors to the Open Cluster Management project
set -e

echo "> Running build/run-unit-tests.sh"
#echo "!!!!! Unit tests are currently disabled. Re-enable in ./build/run-unit-tests.sh !!!!"

make compile-plugin

cd web/scss/
sed "s/..\/..\/..\/..\/..\//..\/..\//" index.scss > new-index.scss
mv new-index.scss index.scss

cd ../..
npm run buildCSS
make run-unit-tests

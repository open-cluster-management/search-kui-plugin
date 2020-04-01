#!/bin/bash

echo 'cloning kui-web-terminal repo'
git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git
cd kui-web-terminal/

echo 'initialize tests repo'
# make test-module
git submodule update --init --recursive
cp ../../tests/e2e/search.test.js ./tests/tests/e2e/
cp ../../tests/page-objects/Search.js ./tests/tests/page-objects

cd ../..
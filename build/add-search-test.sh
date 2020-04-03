#!/bin/bash

echo 'cloning kui-web-terminal repo'
git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git
cd kui-web-terminal/

echo 'initialize tests repo'
make test-module

# rm ./tests/tests/e2e/* # remove kui tests for faster build/test debug
rm ./tests/tests/commands/enter.js # temp replacing enter until we merge with CORE

mkdir ./tests/tests/{e2e/searchPlugin/,page-objects/searchPlugin/}

cp ../../tests/e2e/search.test.js ./tests/tests/e2e/searchPlugin/
cp ../../tests/page-objects/Search.js ./tests/tests/page-objects/searchPlugin/
cp ../../tests/commands/enter.js ./tests/tests/commands/

cd ../..
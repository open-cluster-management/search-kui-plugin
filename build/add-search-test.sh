#!/bin/bash

echo 'cloning kui-web-terminal repo'
git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git
cd kui-web-terminal/

echo 'initialize tests repo'
make test-module

# rm ./tests/tests/e2e/* # remove kui tests for faster build/test debug
rm ./tests/tests/commands/enter.js

cp ../../tests/e2e/search.test.js ./tests/tests/e2e/
cp ../../tests/page-objects/Search.js ./tests/tests/page-objects
cp ../../tests/commands/enter.js ./tests/tests/commands/

cd ../..
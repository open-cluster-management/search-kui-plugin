#!/bin/bash
set -e

echo "> Running build/run-unit-tests.sh"
npm run compile
cd web/scss/
sed "s/..\/..\/..\/..\/..\//..\/..\/..\/..\//" index.scss > new-index.scss
mv new-index.scss index.scss
cd ..
npm run buildCSS
make run-unit-tests

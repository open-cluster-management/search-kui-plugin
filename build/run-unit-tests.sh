#!/bin/bash
set -e

echo "> Running build/run-unit-tests.sh"

npm run compile
npm run buildCSS
npm run test
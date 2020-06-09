#!/bin/bash
set -e

echo "> Running build/build.sh"

export DOCKER_IMAGE_AND_TAG=${1}

npm run compile
npx --no-install babel mdist --out-dir dist --ignore '**/*.d.ts','**/*.js.map' --no-copy-ignored
make package
make integrate-plugin
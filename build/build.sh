#!/bin/bash
set -e

echo "> Running build/build.sh"

export DOCKER_IMAGE_AND_TAG=${1}

npm run compile
make package
make integrate-plugin
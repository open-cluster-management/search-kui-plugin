#!/bin/bash
set -e

echo "> Running build/build.sh"

export DOCKER_IMAGE_AND_TAG=${1}
docker login
make run-search-api
make install
make package
make integrate-plugin

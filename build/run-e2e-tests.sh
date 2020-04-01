#!/bin/bash
set -e

echo "> Running tests from mcm-kui-test repo"
export DOCKER_IMAGE_AND_TAG=${1}

cd build/kui-web-terminal
make run-all-tests

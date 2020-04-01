#!/bin/bash
set -e

echo "> Running tests from mcm-kui-test repo"
export DOCKER_IMAGE_AND_TAG=${1}

cd kui-web-terminal/tests/
make run-all-tests

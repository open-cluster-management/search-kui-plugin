#!/bin/bash
set -e

echo "> Running tests from mcm-kui-test repo"
export DOCKER_IMAGE_AND_TAG=${1}

cd build/kui-web-terminal
sudo make -C tests install-oc
make -C tests login-oc
make run-all-tests

cd ../..
#!/bin/bash
set -e

echo "> Running tests from mcm-kui-test repo"
export DOCKER_IMAGE_AND_TAG=${1}

sudo make -C kui-tests install-oc
make -C kui-tests login-oc
make run-e2e-tests

cd ../..
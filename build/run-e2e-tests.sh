#!/bin/bash
set -e

echo "> Running build/run-e2e-tests.sh"
export DOCKER_IMAGE_AND_TAG=${1}

sudo make -C kui-tests install-oc
make -C kui-tests login-oc
make run-test-containers
make run-e2e-tests

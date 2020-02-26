#!/bin/bash
set -e

echo "> Running build/run-unit-tests.sh"
make install
tsc
make run-plugin-tests

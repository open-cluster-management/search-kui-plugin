#!/bin/bash
set -e

echo "> Running build/run-unit-tests.sh"
make run-plugin-tests: install

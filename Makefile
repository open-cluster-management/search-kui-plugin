###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

SEARCH_IMAGE ?= quay.io/open-cluster-management/search-api:3.5.0-SNAPSHOT-2020-04-30-22-40-54
CONSOLE_IMAGE ?= quay.io/open-cluster-management/console-api:1.0.0-SNAPSHOT-2020-04-30-22-40-54

.PHONY: init\:
init::
	@mkdir -p variables
ifndef GITHUB_USER
	$(info GITHUB_USER not defined)
	exit -1
endif
	$(info Using GITHUB_USER=$(GITHUB_USER))
ifndef GITHUB_TOKEN
	$(info GITHUB_TOKEN not defined)
	exit -1
endif

-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/open-cluster-management/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

default::
	@echo "Build Harness Bootstrapped"

DOCKER_IMAGE ?= $(shell cat COMPONENT_NAME)

# # search-plugin build/test

.PHONY: install
install:
	# npm install -g typescript sass carbon-components
	# npm install
	npm run buildCSS

.PHONY: package
package:
	tsc
	mkdir ./dist/src-web/styles && cp ./src/src-web/styles/index.css ./dist/src-web/styles
	cp -r ./dist ./mdist
	ls -a
	npm pack
	mv kui-shell-plugin-search-0.0.0-semantically-released.tgz plugin-search.tgz

.PHONY: integrate-plugin
integrate-plugin:
	@cd build; \
		./build-kui-web-terminal.sh

# .PHONY: copyright-check
# copyright-check:
# 	./build-tools/copyright-check.sh

.PHONY: run
run:
	$(MAKE) -C kui-tests run DOCKER_IMAGE_AND_TAG=$(DOCKER_IMAGE_AND_TAG)

.PHONY: run-unit-tests
run-unit-tests:
	tsc
ifeq ($(UNIT_TESTS), TRUE)
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm run test
endif

.PHONY: run-test-containers
run-test-containers:
	docker network create --subnet 10.10.0.0/16 console-network
	docker pull ${CONSOLE_IMAGE}
	docker pull ${SEARCH_IMAGE}
	docker run \
	-e NODE_ENV=test \
	-e MOCK=true \
	--network console-network \
	--name console-api \
	--ip 10.10.0.5 \
	-d -p 127.0.0.1:4000:4000 ${CONSOLE_IMAGE}
	docker run \
	-e NODE_ENV=test \
	-e MOCK=true \
	--network console-network \
	--name search-api \
	--ip 10.10.0.6 \
	-d -p 127.0.0.1:4010:4010 ${SEARCH_IMAGE}

.PHONY: run-e2e-tests
run-e2e-tests:
ifeq ($(TEST_LOCAL), true)
	$(SELF) run > /dev/null
	$(MAKE) -C kui-tests setup-dependencies
	$(MAKE) -C kui-tests run-all-tests
else
	@echo Tests are disabled, export TEST_LOCAL="true" to run tests.
endif

.PHONY: test-module
test-module:
	sed -i "s/git@github.com:/https:\/\/$(GITHUB_USER):$(GITHUB_TOKEN)@github.com\//" .gitmodules
	git submodule update --init --recursive

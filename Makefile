###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

DOCKER_IMAGE ?= $(shell cat COMPONENT_NAME)

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

# # search-plugin build/test

.PHONY: compile-plugin
compile-plugin:
	npm run compile
	npm run buildCSS
	rsync -a ./dist/. ./mdist/

.PHONY: package
package:
	npm pack
	mv kui-shell-plugin-search-0.0.0-semantically-released.tgz plugin-search.tgz

.PHONY: integrate-plugin
integrate-plugin:
	@cd build; \
		./build-kui-web-terminal.sh

.PHONY: copyright-check
copyright-check:
	./build/copyright-check.sh

.PHONY: run-unit-tests
run-unit-tests:
	npm run test:coverage


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
	
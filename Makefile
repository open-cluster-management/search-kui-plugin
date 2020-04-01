###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

BROWSER ?= firefox

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
	npm pack
	mv kui-shell-plugin-search-0.0.0-semantically-released.tgz plugin-search.tgz

.PHONY: integrate-plugin
integrate-plugin:
	@cd build; \
		./build-kui-web-terminal.sh

# .PHONY: copyright-check
# copyright-check:
# 	./build-tools/copyright-check.sh

.PHONY: run-unit-tests
run-unit-tests:
	tsc
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm run test

.PHONY: run-e2e-tests
run-e2e-tests:
ifeq ($(TEST_LOCAL), TRUE)
	$(SELF) run > /dev/null
	if [ ! -d "node_modules" ]; then \
		npm install; \
	fi
	if [ ! -d "test-output" ]; then \
		mkdir test-output; \
	fi
	npm run test:$(BROWSER)
else
	@echo e2e tests are disabled, export TEST_LOCAL="true" to run tests.
endif

.PHONY: install-oc
install-oc:
	@bash scripts/install-oc.sh
.PHONY: login-oc
login-oc:
	@bash scripts/login-oc.sh

# .PHONY: run
# run:
# 	$(SELF) docker:run AUTH_TOKEN=$(shell curl -H "Content-Type: application/x-www-form-urlencoded;charset=UTF-8" -d "grant_type=password&username="$(K8S_CLUSTER_USER)"&password="$(K8S_CLUSTER_PASSWORD)"&scope=openid" $(ICP_EXTERNAL_URL)/idprovider/v1/auth/identitytoken --insecure | jq '.access_token' | tr -d '"')

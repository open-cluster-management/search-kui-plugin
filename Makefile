###############################################################################
# Licensed Materials - Property of IBM Copyright IBM Corporation 2019. All Rights Reserved.
# U.S. Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
# Schedule Contract with IBM Corp.
#
# Contributors:
#  IBM Corporation - initial API and implementation
###############################################################################

-include $(shell curl -H 'Authorization: token ${GITHUB_TOKEN}' -H 'Accept: application/vnd.github.v4.raw' -L https://api.github.com/repos/stolostron/build-harness-extensions/contents/templates/Makefile.build-harness-bootstrap -o .build-harness-bootstrap; echo .build-harness-bootstrap)

default::
	@echo "Build Harness Bootstrapped"

DOCKER_IMAGE ?= $(shell cat COMPONENT_NAME)
BABEL_PLUGINS=@babel/plugin-transform-modules-commonjs,dynamic-import-node-babel-7,babel-plugin-ignore-html-and-css-imports
# # search-plugin build/test


.PHONY: compile-plugin
compile-plugin:
	mkdir -p dist
	npm run compile
	npx --no-install babel --plugins ${BABEL_PLUGINS} mdist --out-dir dist --ignore '**/*.d.ts','**/*.js.map' --no-copy-ignored

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

#!/bin/bash

SEARCH_PLUGIN_DIR=$(pwd)

echo "Clone plugin-kubectl-boilerplate."
cd ..
git clone git@github.com:kui-shell/plugin-kubectl-boilerplate.git
cd plugin-kubectl-boilerplate/
git checkout -b ocm-dev 2374814c0b737d0e84f34c2005a7af5ea5f942d7

KUI_REPO_DIR=$(pwd)

echo "Configure plugin-kubectl-boilerplate repo."
echo "Update package.json"

jq '.devDependencies |= . +{"@kui-shell/plugin-search": $searchPluginDir}' --arg searchPluginDir "file:${SEARCH_PLUGIN_DIR}" package.json > new.package.json
mv new.package.json package.json
#  "devDependencies": {
#     "@kui-shell/plugin-search": "file:plugins/plugin-search",

echo "Update tsconfig.json"

jq '.references + [{ "path": $searchPluginDir }]' --arg searchPluginDir $SEARCH_PLUGIN_DIR tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json

# "references": [
#     { "path": "./plugins/plugin-sample" },
#     { "path": "./plugins/plugin-search" }
#   ]

echo "Update tsconfig-es6.json"

jq '.references + [{ "path": $path }]' --arg path "${SEARCH_PLUGIN_DIR}/tsconfig-es6.json" tsconfig-es6.json > new.tsconfig-es6.json
mv new.tsconfig-es6.json tsconfig-es6.json
# "references": [
#     { "path": "./plugins/plugin-sample/tsconfig-es6.json" },
#     { "path": "./plugins/plugin-search/tsconfig-es6.json" }
#   ]

echo "Configure search-kui-plugin repo"
cd $SEARCH_PLUGIN_DIR

echo "Update tsconfig.json"

jq '. |= . +{"extends": $path}' --arg path "${KUI_REPO_DIR}/node_modules/@kui-shell/builder/tsconfig-base.json" tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json
# "extends": "../../node_modules/@kui-shell/builder/tsconfig-base.json",


echo "Update src/lib/shared/search.json"


echo "Update src/lib/shared/search-auth.json"

echo "Runing 'npm i' on $SEARCH_PLUGIN_DIR"
npm i
echo "Runing 'npm run buildCSS' on $SEARCH_PLUGIN_DIR"
npm run buildCSS

cd $KUI_REPO_DIR
echo "Runing 'npm i' on $KUI_REPO_DIR"
npm i

echo " DONE"


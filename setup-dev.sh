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

jq '.dependencies |= . +{"@kui-shell/plugin-search": $searchPluginDir}' --arg searchPluginDir "file:${SEARCH_PLUGIN_DIR}" package.json > new.package.json
mv new.package.json package.json
#  "devDependencies": {
#     "@kui-shell/plugin-search": "file:plugins/plugin-search",


echo "Update tsconfig.json"

jq '.references += [{ "path": $searchPluginDir }]' --arg searchPluginDir $SEARCH_PLUGIN_DIR tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json
# "references": [
#     { "path": "./plugins/plugin-sample" },
#     { "path": "./plugins/plugin-search" }
#   ]


echo "Update tsconfig-es6.json"

jq '.references += [{ "path": $path }]' --arg path "${SEARCH_PLUGIN_DIR}/tsconfig-es6.json" tsconfig-es6.json > new.tsconfig-es6.json
mv new.tsconfig-es6.json tsconfig-es6.json
# "references": [
#     { "path": "./plugins/plugin-sample/tsconfig-es6.json" },
#     { "path": "./plugins/plugin-search/tsconfig-es6.json" }
#   ]

echo "Update style.json in plugin-kubeui-client"
cd plugins/plugin-kubeui-client/config.d
jq '.bodyCss = ["kui kui--bottom-input"]' style.json > new.style.json
mv new.style.json style.json
#   "bodyCss": ["kui kui--bottom-input"]

# cd ../${KUI_REPO_DIR}
# mv search-kui-plugin ./plugin-kubectl-boilerplate/plugins/plugin-search


echo "Configure search-kui-plugin repo"
cd $SEARCH_PLUGIN_DIR


echo "Update tsconfig.json"

jq '. |= . +{"extends": $path}' --arg path "${KUI_REPO_DIR}/node_modules/@kui-shell/builder/tsconfig-base.json" tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json
# "extends": "../../node_modules/@kui-shell/builder/tsconfig-base.json",


echo "Update src/lib/shared/search.json"
CONSOLE_RT=$(oc get routes -n open-cluster-management | grep console-api | awk '{print $2;}')
SEARCH_RT=$(oc get routes -n open-cluster-management | grep search-api | awk '{print $2;}')
CONSOLE=$(oc get routes -n open-cluster-management | grep multicloud-console | awk '{print $2;}')

CONSOLE_API="https://${CONSOLE_RT}/hcmuiapi/graphql"
SEARCH_API="https://${SEARCH_RT}/searchapi/graphql"
SEARCH_SVC="https://${CONSOLE}/multicloud/servicediscovery/search"

jq '. +{"CONSOLE_API": $consoleApi, "SEARCH_API": $searchApi, "SEARCH_SERVICE": $searchSvc}' --arg consoleApi $CONSOLE_API --arg searchApi $SEARCH_API --arg searchSvc $SEARCH_SVC src/lib/shared/search.json > new.search.json
mv new.search.json src/lib/shared/search.json


echo "Update src/lib/shared/search-auth.json"

TOKEN=$(oc whoami -t)
jq '. +{"authorization": $auth, "cookie": $cookie}' --arg auth "Bearer ${TOKEN}" --arg cookie "cfc-cookie-access-token=${TOKEN}" src/lib/shared/search-auth.json > new.search-auth.json
mv new.search-auth.json src/lib/shared/search-auth.json


echo "Running 'npm i' on $SEARCH_PLUGIN_DIR"
npm i
sleep 5

cd $KUI_REPO_DIR
echo "Running 'npm i' on $KUI_REPO_DIR"
npm i

cd $SEARCH_PLUGIN_DIR

echo "Running 'make compile-plugin' on $SEARCH_PLUGIN_DIR"
make compile-plugin

echo " DONE"


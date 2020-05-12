#!/bin/bash
# This script sets up the search-kui-plugin development environment.


# Utility to format section title.
format_title () {
  printf "\n"
  echo "$(tput bold)$1$(tput sgr0)"  # Bold text
}

# Check plugin-kubectl-boilerplate wasn't cloned before.
if [ -d "../plugin-kubectl-boilerplate" ]; then
  echo "ERROR setting up environment: Project plugin-kubectl-boilerplate already exist at: $(cd .. && pwd)/plugin-kubectl-boilerplate"
  echo "Delete this folder and try again.\n"
  exit 0
fi

#Ask user for confirmation to proceed.
echo "This script sets up the search-kui-plugin development environment."
echo "Target Cluster: $(oc cluster-info | head -n 1 | awk '{print $NF}')\n"

echo "Enter 'y' if you wish to continue."
read -r ACCEPT
if [ "${ACCEPT}" != "y" ]; then
  echo "Development setup aborted."
  exit 0
fi

SEARCH_PLUGIN_DIR=$(pwd)
format_title "Step 1: Clone plugin-kubectl-boilerplate."
cd ..
git clone git@github.com:kui-shell/plugin-kubectl-boilerplate.git
cd plugin-kubectl-boilerplate/
git checkout -b ocm-dev 2374814c0b737d0e84f34c2005a7af5ea5f942d7
KUI_REPO_DIR=$(pwd)

format_title "Step 2: Configure plugin-kubectl-boilerplate repo."

# 2a. Update package.json 
# ADD:    "dependencies": { "@kui-shell/plugin-search": "file:SEARCH_PLUGIN_DIR"} 
# DELETE: "dependencies": { "@kui-shell/plugin-sample" }
# 
jq '.dependencies |= del(.["@kui-shell/plugin-sample"]) | .dependencies |= . +{"@kui-shell/plugin-search": $searchPluginDir}' --arg searchPluginDir "file:${SEARCH_PLUGIN_DIR}" package.json > new.package.json
mv new.package.json package.json

# 2b. Update tsconfig.json
# "references": [{ "path": "SEARCH_PLUGIN_DIR" }]
jq '.references += [{ "path": $searchPluginDir }]' --arg searchPluginDir $SEARCH_PLUGIN_DIR tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json


# 2c. Update tsconfig-es6.json
# "references": [{ "path": "SEARCH_PLUGIN_DIR/tsconfig-es6.json" }]
jq '.references += [{ "path": $path }]' --arg path "${SEARCH_PLUGIN_DIR}/tsconfig-es6.json" tsconfig-es6.json > new.tsconfig-es6.json
mv new.tsconfig-es6.json tsconfig-es6.json


# 2d. Update style.json in plugin-kubeui-client
# "bodyCss": ["kui kui--bottom-input"]
cd plugins/plugin-kubeui-client/config.d
jq '.bodyCss = ["kui kui--bottom-input"]' style.json > new.style.json
mv new.style.json style.json


format_title "Step 3: Configure search-kui-plugin repo."
cd $SEARCH_PLUGIN_DIR

# 3a. Update tsconfig.json
# "extends": "../../node_modules/@kui-shell/builder/tsconfig-base.json",
jq '. |= . +{"extends": $path}' --arg path "${KUI_REPO_DIR}/node_modules/@kui-shell/builder/tsconfig-base.json" tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json

# 3b. Update src/lib/shared/search.json with routes to development cluster

# Attempt to create console-api and search-api routes. 
oc create route passthrough console-api --service=console-api --insecure-policy=Redirect -n open-cluster-management
oc create route passthrough search-api --service=search-search-api --insecure-policy=Redirect -n open-cluster-management

CONSOLE_ROUTE=$(oc get routes -n open-cluster-management | grep console-api | awk '{print $2;}')
SEARCH_ROUTE=$(oc get routes -n open-cluster-management | grep search-api | awk '{print $2;}')
CONSOLE=$(oc get routes -n open-cluster-management | grep multicloud-console | awk '{print $2;}')

CONSOLE_API="https://${CONSOLE_ROUTE}/hcmuiapi/graphql"
SEARCH_API="https://${SEARCH_ROUTE}/searchapi/graphql"
SEARCH_SVC="https://${CONSOLE}/multicloud/servicediscovery/search"

jq '. +{"CONSOLE_API": $consoleApi, "SEARCH_API": $searchApi, "SEARCH_SERVICE": $searchSvc}' --arg consoleApi $CONSOLE_API --arg searchApi $SEARCH_API --arg searchSvc $SEARCH_SVC src/lib/shared/search.json > new.search.json
mv new.search.json src/lib/shared/search.json


# 3c. Update src/lib/shared/search-auth.json with token to development cluster
TOKEN=$(oc whoami -t)
jq '. +{"authorization": $auth, "cookie": $cookie}' --arg auth "Bearer ${TOKEN}" --arg cookie "cfc-cookie-access-token=${TOKEN}" src/lib/shared/search-auth.json > new.search-auth.json
mv new.search-auth.json src/lib/shared/search-auth.json


format_title "Step 4: Running 'npm install' on $SEARCH_PLUGIN_DIR"
npm i
sleep 1

cd $KUI_REPO_DIR
format_title "Step 5: Runing 'npm install' on $KUI_REPO_DIR"
npm i


format_title "Step 6: Running 'npm run compile' and 'npm run buildCSS' on $SEARCH_PLUGIN_DIR"
cd $SEARCH_PLUGIN_DIR
npm run compile
npm run buildCSS

# TODO: Need to revisit why this duplication is needed.
cp -a ./dist/ ./mdist

format_title "DONE setting up project for development." 
echo "To start the project run:"
echo "  npm run start"

#!/bin/bash
# This script sets up the search-kui-plugin development environment.


# Utility to format section title.
format_title () {
  printf "\n"
  echo "$(tput bold)$1$(tput sgr0)"  # Bold text
}

# Check kui wasn't cloned before.
if [ -d "/kui" ]; then
  echo "ERROR setting up environment: Project IBM/kui already exist at: $(pwd)/kui"
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

format_title "Step 1: Clone IBM/Kui monorepo and move search-plugin into plugins folder"
git clone git@github.com:IBM/kui.git
mv search-kui-plugin kui/plugins/plugin-search
cd kui/
npm i
KUI_REPO_DIR=$(pwd)
cd plugins/plugin-search
SEARCH_PLUGIN_DIR=$(pwd)


format_title "Step 2: Configure IBM/Kui repo."
cd $KUI_REPO_DIR
# 2a. Update package.json 
# ADD:    "dependencies": { "@kui-shell/plugin-search": "file:SEARCH_PLUGIN_DIR"} 
jq '.dependencies |= . +{"@kui-shell/plugin-search": $searchPluginDir}' --arg searchPluginDir "file:plugins/plugin-search" package.json > new.package.json
mv new.package.json package.json

# 2b. Update tsconfig.json
# "references": [{ "path": "SEARCH_PLUGIN_DIR" }]
jq '.references += [{ "path": $searchPluginDir }]' --arg searchPluginDir 'plugins/plugin-search' tsconfig.json > new.tsconfig.json
mv new.tsconfig.json tsconfig.json

# 2c. Update index.tsx in plugin-client-alternate
# import CustomSearchInput
cd plugins/plugin-client-alternate/src/
sed -i -e "s/CustomInput/CustomSearchInput/;s/.\/CustomInput/@kui-shell\/plugin-search\/mdist\/components\/CustomSearchInput/" index.tsx


format_title "Step 3: Configure search-kui-plugin repo."
cd $SEARCH_PLUGIN_DIR

# 3a. Update tsconfig.json
# "extends": "../../packages/builder/tsconfig-base.json",
jq '. |= . +{"extends": $path}' --arg path "../../packages/builder/tsconfig-base.json" tsconfig.json > new.tsconfig.json
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

jq '. +{"CONSOLE_API": $consoleApi, "SEARCH_API": $searchApi}' --arg consoleApi $CONSOLE_API --arg searchApi $SEARCH_API src/lib/shared/search.json > new.search.json
mv new.search.json src/lib/shared/search.json


# 3c. Update src/lib/shared/search-auth.json with token to development cluster
TOKEN=$(oc whoami -t)
jq '. +{"authorization": $auth, "cookie": $cookie}' --arg auth "Bearer ${TOKEN}" --arg cookie "cfc-cookie-access-token=${TOKEN}" src/lib/shared/search-auth.json > new.search-auth.json
mv new.search-auth.json src/lib/shared/search-auth.json

# 3d. Uninstall redundant dependencies that are in kui/client
npm uninstall \
@kui-shell/plugin-client-common \
carbon-components \
carbon-components-react \
carbon-icons

# 3e. Update web/scss/index.scss global/scss reference
cd web/scss/
sed "s/..\/..\/..\/..\/..\//..\/..\/..\/..\//" index.scss > new-index.scss
mv new-index.scss index.scss

cd $SEARCH_PLUGIN_DIR
format_title "Step 4: Running 'npm install' on $SEARCH_PLUGIN_DIR"
npm i
sleep 1


format_title "Step 5: Running 'npm run compile' on $SEARCH_PLUGIN_DIR"
npm run compile


cd $KUI_REPO_DIR
npx kui-compile
format_title "Step 6: rerun npm i and switch context to alternate client"
npm i
./bin/switch-client.sh alternate


cd $SEARCH_PLUGIN_DIR
# rm ../setup-dev.sh
format_title "DONE setting up project for development." 
echo "To start the dev server run:"
echo "  npm run start:watch  "
echo "In new terminal window run:"
echo "  npm run open  "
echo "This will open an electron instance"

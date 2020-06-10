#!/bin/bash

# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2019. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

# Utility to format section title.
# format_title () {
#   printf "\n"
#   echo "$(tput bold)$1$(tput sgr0)"  # Bold text
# }

set -e

# cd ../..
# git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git
git clone https://github.com/open-cluster-management/kui-web-terminal.git -b rhowingt/search-plugin
cd kui-web-terminal/


# cp -r search-kui-plugin kui-web-terminal/client/plugins/plugin-search
# cd kui-web-terminal/client
# KUI_CLIENT_DIR=$(pwd)
# cd plugins/plugin-search
# SEARCH_PLUGIN_DIR=$(pwd)

# format_title "Step 2: Configure IBM/Kui repo."
# cd $KUI_CLIENT_DIR
# # 2a. Update package.json 
# # ADD:    "dependencies": { "@kui-shell/plugin-search": "file:SEARCH_PLUGIN_DIR"} 
# jq '.dependencies |= . +{"@kui-shell/plugin-search": $searchPluginDir}' --arg searchPluginDir "file:plugins/plugin-search" package.json > new.package.json
# mv new.package.json package.json

# # 2b. Update tsconfig.json
# # "references": [{ "path": "SEARCH_PLUGIN_DIR" }]
# jq '.references = [{ "path": $searchPluginDir }]' --arg searchPluginDir 'plugins/plugin-search' tsconfig.json > new.tsconfig.json
# mv new.tsconfig.json tsconfig.json

# format_title "Step 3: Configure search-kui-plugin repo."
# cd $SEARCH_PLUGIN_DIR

# # 3a. Update tsconfig.json
# # "extends": "../../tsconfig.json",
# jq '. |= . +{"extends": $path}' --arg path "${KUI_CLIENT_DIR}/tsconfig.json" tsconfig.json > new.tsconfig.json
# mv new.tsconfig.json tsconfig.json

# format_title "Step 4: Compile/pack within KWT/client"
# cd $KUI_CLIENT_DIR
# npm i

# cd $SEARCH_PLUGIN_DIR
# npm pack
# mv kui-shell-plugin-search-0.0.0-semantically-released.tgz plugin-search.tgz

# format_title "Step 5: Integrate plugin and build image"
# cd $KUI_CLIENT_DIR/..

make init
make download-clis
make download-plugins
rm plugin-downloads/plugin-search.tgz
cp ../../plugin-search.tgz ./plugin-downloads

make -C client client-update-plugins

echo "Installing proxy and client"
make install-proxy
make install-client
make webpack
make headless
make build-image

cd ../..

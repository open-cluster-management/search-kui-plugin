#!/bin/bash

# Licensed Materials - Property of IBM
# (c) Copyright IBM Corporation 2019. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights:
# Use, duplication or disclosure restricted by GSA ADP Schedule
# Contract with IBM Corp.

set -e

# git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git -b rhowingt/search-plugin
git clone --depth=50 https://github.com/open-cluster-management/kui-web-terminal.git

cd kui-web-terminal/


make init
make download-clis
make download-plugins
rm plugin-downloads/plugin-search.tgz
cp ../../plugin-search.tgz ./plugin-downloads

make -C client client-update-plugins

# echo "Add CustomSearchInput to client index.tsx"
# cd client/src/
# sed -i -e "s/bottomInput/bottomInput={<CustomSearchInput/>}/;s/.\/CustomInput/@kui-shell\/plugin-search\/mdist\/components\/CustomSearchInput/" index.tsx
# sed '35 import CustomSearchInput from "@kui-shell/plugin-search/mdist/components/CustomSearchInput"'

echo "Installing proxy and client"
make install-proxy
make install-client
make webpack
make headless
make build-image

cd ../..

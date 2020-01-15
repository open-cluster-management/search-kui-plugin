/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
import { inBrowser } from '@kui-shell/core'

const nconf = require('nconf')

const WHITELIST = [
  'contextPath',
]

const getXsrfToken = () => {
  const token = document.querySelector('#app-access') ? document.querySelector('#app-access')['value'] : ''
  return token.toString('ascii')
}

let config = {
  env: '',
  // TODO - Electron needs to grab backend urls somehow  Ex: https://<cluster-ip>:<backend-port>/(searchapi || hcmuiapi)/graphql
  // To ensure that the search-api is installed, Electron needs to grab the url Ex: https://<cluster-ip>:8443/multicloud/servicediscovery/search
  // Browser can grab backend urls from the window.location.origin
  SEARCH_API: inBrowser()
    ? `${window && window.location && window.location.origin}/multicloud/search/graphql`
    : '',
  MCM_API: inBrowser()
    ? `${window && window.location && window.location.origin}/multicloud/graphql`
    : '',
  SEARCH_SERVICE: inBrowser()
    ? `${window && window.location && window.location.origin}/multicloud/servicediscovery/search`
    : '',

  // Browser needs xsrf token for requests
  xsrfToken: inBrowser() ? getXsrfToken() : null,

  // Electron needs the user access token
  authorization: `Bearer token`,
  cookie: `cfc-access-token-cookie=token`,
}

if (nconf) {
  WHITELIST.forEach((i) => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

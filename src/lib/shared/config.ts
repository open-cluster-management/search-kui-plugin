/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
import { inBrowser } from '@kui-shell/core'

let staticConfig
if (process.env.NODE_ENV === 'development'){
  staticConfig = require('@kui-shell/client/config.d/search.json')
}

const getXsrfToken = () => {
  const token = document.querySelector('#app-access') ? document.querySelector('#app-access')['value'] : ''
  return token.toString('ascii')
}

interface StaticConfig {
  env: string
  SEARCH_API: string
  CONSOLE_API: string
  SEARCH_SERVICE: string
}

interface AuthConfig {
  authorization: string
  cookie?: string
}

export type Config = StaticConfig &
  AuthConfig & {
    xsrfToken: string
  }

export async function getConfig(): Promise<Config> {

  const nconf = require('nconf')
  const WHITELIST = ['contextPath']
  const origin = window && window.location && window.location.origin

  let config: Config = Object.assign(
    {
      env: '',
      // Electron needs to grab backend urls somehow  Ex: https://<cluster-ip>:<backend-port>/(searchapi || hcmuiapi)/graphql
      // To ensure that the search-api is installed, Electron needs to grab the url Ex: https://<cluster-ip>:8443/multicloud/servicediscovery/search
      // Browser can grab backend urls from the window.location.origin
      SEARCH_API: inBrowser()
        ? `${origin}/multicloud/search/graphql`
        : staticConfig.SEARCH_API,
      CONSOLE_API: inBrowser()
        ? `${origin}/multicloud/graphql`
        : staticConfig.CONSOLE_API,
      SEARCH_SERVICE: inBrowser()
        ? `${origin}/multicloud/servicediscovery/search`
        : staticConfig.SEARCH_SERVICE,
    },
    {
      // Browser needs xsrf token for requests
      xsrfToken: inBrowser() ? getXsrfToken() : null,

        // Electron needs the user access token
      authorization: 'Bearer ',
      cookie: 'cfc-cookie-access-token=',
    },
  )

  if (process.env.NODE_ENV === 'development') {
    try {
      const authConfig: AuthConfig = require('@kui-shell/client/config.d/search-auth.json')
      if (authConfig.authorization) {
        config.authorization = authConfig.authorization
        config.cookie = authConfig.cookie
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (nconf) {
    WHITELIST.forEach((i) => {
      config[i] = nconf.get(i)
    })
    if (process.env.NODE_ENV) {
      config.env = process.env.NODE_ENV
    }
  } else {
    const configElement = document.getElementById('config')
    config = (configElement && JSON.parse(configElement.textContent)) || {}
  }

  return config
}

export default getConfig

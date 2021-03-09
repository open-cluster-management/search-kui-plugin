/*******************************************************************************
*
* Copyright (c) 2020 Red Hat, Inc.
*
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

import { inBrowser } from '@kui-shell/core'

let staticConfig
if (process.env.NODE_ENV === 'development') {
  staticConfig = require('./search.json')
}

const getXsrfToken = () => {
  const metaTag = document!.body!.querySelector('meta[name=csrf-token]')! as HTMLMetaElement
  return metaTag?.content || ''
}

interface StaticConfig {
  env: string
  SEARCH_API: string
  CONSOLE_API: string
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

  let config: Config = Object.assign(
    {
      env: '',
      // Electron needs to grab backend urls somehow  Ex: https://<cluster-ip>:<backend-port>/(searchapi || hcmuiapi)/graphql
      // Browser can grab backend urls from the window.location.origin
      SEARCH_API: staticConfig
      ? staticConfig.SEARCH_API
      : `${window && window.location && window.location.origin}/searchapi/graphql`,
      CONSOLE_API: staticConfig
      ? staticConfig.CONSOLE_API
      : `${window && window.location && window.location.origin}/search/console-api/graphql`,
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
      const authConfig: AuthConfig = require('./search-auth.json')
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

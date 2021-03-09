/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import axios from 'axios'
import * as needle from 'needle'
import { Config, getConfig } from '../lib/shared/config'

// Browser requires xsrf token for calls & and electron needs the access token
function getHeaders(config: Config) {
  if (process.env.NODE_ENV === 'development') {
    return {
      'content-type': 'application/json',
      authorization: config.authorization,
      // Allows cookies to be passed in electron.
      Cookie: config.cookie,
    }
  }
  return {
    'content-type': 'application/json',
    'csrf-token': config.xsrfToken,
  }
}

export default async function HTTPClient(method, urlType, requestBody) {
  const config = await getConfig()
  const url = urlType === 'search' ? config.SEARCH_API : config.CONSOLE_API

  let agent = null
  if (config.env === 'development') {
    // Need the agent to get around ssl cert issues
    const { Agent } = await import('https')
    agent = new Agent({ rejectUnauthorized: false })
  }

  // TODO:Rob - figure out same dependency here for http req
  if (process.env.NODE_ENV === 'development') {
    return needle(method, url, requestBody || {}, {
      json: true,
      headers: getHeaders(config),
      agent,
      timeout: 5000, // Timeout after 5 seconds
    }).then((res) => {
      return res.body
    }).catch((err) => {
      throw new Error(err)
    })
  }
  return (
    axios({
      method,
      url,
      headers: getHeaders(config),
      data: requestBody,
      withCredentials: true,
      httpsAgent: agent,
      timeout: 10000, // Timeout after 10 seconds
    }).then((res) => {
      return res.data
    }).catch((err) => {
      throw new Error(err)
    })
  )
}

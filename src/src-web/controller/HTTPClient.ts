/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import axios from 'axios'
import { inElectron } from '@kui-shell/core/core/capabilities'

const config = require('../../lib/shared/config')

// Need the agent in electron to get around ssl cert issues
let agent = null
if (inElectron) {
  const https = require('https')
  agent = new https.Agent({ rejectUnauthorized: false })
}

// Browser requires xsrf token for calls & and electron needs the access token
function getHeaders() {
  if (inElectron()) {
    return {
      'content-type': 'application/json',
      'authorization': config.authorization,
      // Allows cookies to be passed in electron.
      'Cookie': config.cookie,
    }
  }
  return {
    'content-type': 'application/json',
    'XSRF-Token': config.xsrfToken,
  }
}

/**
 * Axios is a Promise based HTTP client for the browser and node.js
 * @param method - post, get etc
 * @param urlType - search || mcm to determine backend
 * @param requestBody - post request body
 */
export default function HTTPClient(method, urlType, requestBody) {
  return (
    axios({
      method,
      url: urlType === 'search' ? config.SEARCH_API : urlType && requestBody
        ? config.MCM_API : urlType === 'svc' && !requestBody
        ? config.SEARCH_SERVICE : null,
      headers: getHeaders(),
      data: requestBody,
      withCredentials: true,
      httpsAgent: agent,
    }).then((res) => {
      return res.data
    }).catch((err) => {
      throw new Error(err)
    })
  )
}


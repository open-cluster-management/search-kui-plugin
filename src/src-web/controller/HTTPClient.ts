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

var config = require('../../lib/shared/config')

var agent = null
if (inElectron) {
  const https = require('https')
  agent = new https.Agent({ rejectUnauthorized: false })
}

function getHeaders() {
  if(inElectron()) {
    return {
      "content-type": "application/json",
      authorization: config.authorization
    }
  }
  return {
    "content-type": "application/json",
    "XSRF-Token": config.xsrfToken
  }
}

export default function HTTPClient(method, urlType, requestBody) {
  return (
    axios({
      method,
      url: urlType === 'search' ? config.SEARCH_API : config.MCM_API,
      headers: getHeaders(),
      data: requestBody,
      withCredentials: true,
      httpsAgent: agent
    }).then(res => {
      return res.data
    }).catch(err => {
      throw new Error(err)
    })
  )
}
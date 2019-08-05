/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
var nconf = require('nconf')

var WHITELIST = [
  'contextPath',
]

var config = {
  env: '',
  // Ex: https://<cluster-ip>:30100/searchapi/graphql
  SEARCH_API: process.env.ICP_EXTERNAL_URL ? `https://${process.env.ICP_EXTERNAL_URL.substring(7).split(':')[0]}/4010/searchapi/graphql` : '',
  MCM_API: process.env.ICP_EXTERNAL_URL ? `https://${process.env.ICP_EXTERNAL_URL.substring(7).split(':')[0]}/4000/hcmuiapi/graphql` : '',

  options: {
    // Testing to see if same-origin is being used so we dont need the accessToken
    // headers: {
    //   authorization: `Bearer token`
    // },
    json: true,
    rejectUnauthorized : false
  }
}

if (nconf) {
  WHITELIST.forEach(i => config[i] = nconf.get(i))
  config.env = process.env.NODE_ENV
} else {
  const configElement = document.getElementById('config')
  config = (configElement && JSON.parse(configElement.textContent)) || {}
}

module.exports = config

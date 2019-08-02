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
  //To get an access token use 'cloudctl login -a https://<cluster IP>:8443' then 'cloudctl tokens'
  env: '',
  // Ex: https://<cluster-ip>:30100/searchapi/graphql
  SEARCH_API: '',
  MCM_API: '',

  options: {
    headers: {
      authorization: `Bearer ${'accessToken'}`
    },
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

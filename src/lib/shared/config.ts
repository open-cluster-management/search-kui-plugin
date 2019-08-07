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

const getXsrfToken = () => {
  const token = document.getElementById('app-access') ? document.getElementById('app-access')['value'] : ''
  return token.toString('ascii')
}

var config = {
  env: '',
  // Ex: https://<cluster-ip>:30100/searchapi/graphql
  SEARCH_API: '/multicloud/search/graphql',
  MCM_API: '/multicloud/graphql',

  options: {
    headers: {
      'XSRF-Token': getXsrfToken()
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

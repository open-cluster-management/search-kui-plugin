/******************************************************************************
*
* Copyright (c) 2020 Red Hat, Inc.
*
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

import { CapabilityRegistration, inBrowser } from '@kui-shell/core'
import getConfig from './lib/shared/config'
import HTTPClient from './controller/HTTPClient'
import { setPluginState } from './pluginState'
import * as lodash from 'lodash'
import { GET_SEARCH_SCHEMA } from './definitions/search-queries'

// Register searchBarWrapper
const registerCapability: CapabilityRegistration = async () => {
  if (inBrowser() && (await getConfig()).env !== 'development') {
    // Get user token from browser
    await fetch('/search')
    .then((page) => page.text())
    .then((data) => {
      const dom = new DOMParser().parseFromString(data, 'text/html')
      const metaTag = dom!.body!.querySelector('meta[name=csrf-token]')! as HTMLMetaElement
      const token = metaTag?.content || ''
      let meta = document.createElement('meta')
      meta.setAttribute('name', 'csrf-token')
      meta.setAttribute('content', token)
      document.body.appendChild(meta)
    })
  }

  HTTPClient('post', 'search', GET_SEARCH_SCHEMA)
  .then((resp) => {
    setPluginState('searchSchema', lodash.get(resp, 'data.searchSchema.allProperties', ''))
  })
  .catch((err) => {
    setPluginState('error', err)
  })
}

export default registerCapability

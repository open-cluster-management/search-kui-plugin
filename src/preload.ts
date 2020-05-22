/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CapabilityRegistration, isHeadless, inBrowser } from '@kui-shell/core'
import getConfig from './lib/shared/config'
import HTTPClient from './src-web/controller/HTTPClient'
import { getPluginState, setPluginState } from './pluginState'
import * as lodash from 'lodash'
import { GET_SEARCH_SCHEMA } from './src-web/definitions/search-queries'

// Register searchBarWrapper
const registerCapability: CapabilityRegistration = async () => {
  if (inBrowser() && (await getConfig()).env !== 'development') {
    // Get user token from browser
    fetch('/multicloud/search')
      .then((page) => page.text())
      .then((data) => {
        const dom = new DOMParser().parseFromString(data, 'text/html')
        const access = dom.querySelector('#app-access')
        document.querySelector('body').appendChild(access)
      })
  }

  HTTPClient('get', 'svc', undefined)
  .then((res) => {
    setPluginState('enabled', true)

    if (getPluginState().enabled) {
      HTTPClient('post', 'search', GET_SEARCH_SCHEMA)
      .then((resp) => {
        setPluginState('searchSchema', lodash.get(resp, 'data.searchSchema.allProperties', ''))
      })
      .catch((err) => {
        setPluginState('error', err)
      })
    }
  })
  .catch((err) => {
    setPluginState('enabled', false)
    setPluginState('error', err)
  })

  if (!isHeadless()) {
    // Core by default listens to original input bar
    // We need to override that listen to the hijacked input bar by default
    const [{ InputWrapper }] = await Promise.all([
      import('./src-web/components/InputWrapper')
    ])

    const retry = async () => {
      if (!document.querySelector('.kui--input-stripe')){
        window.requestAnimationFrame(retry);
      } else {
        await InputWrapper(document.querySelector('.kui--input-stripe'))
      }
    }
    retry()

  }
}

export default registerCapability
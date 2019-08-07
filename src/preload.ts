/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { inBrowser } from '@kui-shell/core/core/capabilities'
import { CapabilityRegistration } from '@kui-shell/core/models/plugin'
import { InputWrapper } from './src-web/components/InputWrapper'

// Register searchBarWrapper

export const registerCapability: CapabilityRegistration = async () => {
  // Get user token from browser
  if (inBrowser()) {
    fetch('/multicloud/search').then(page => page.text()).then(data => {
      const dom = new DOMParser().parseFromString(data, 'text/html')
      const access = dom.querySelector('#app-access')
      document.querySelector('body').appendChild(access)
    })
  }

  const stripe: HTMLElement = document.querySelector('.kui--input-stripe')
  await InputWrapper(stripe)
}
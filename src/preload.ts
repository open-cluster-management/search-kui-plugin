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
const registerCapability: CapabilityRegistration = async () => {
  console.log('register inBrowser', inBrowser())
  // Get user token from browser
  if (inBrowser()) {
    console.log('pre-fetch')
    fetch('/multicloud/search').then((page) => page.text()).then((data) => {
      const dom = new DOMParser().parseFromString(data, 'text/html')
      const access = dom.querySelector('#app-access')
      console.log('post-fetch token - ', access)
      document.querySelector('body').appendChild(access)
    })
  }
  console.log('post-fetch pre-hijack')
  const stripe: HTMLElement = document.querySelector('.kui--input-stripe')
  await InputWrapper(stripe)
}

export default registerCapability

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { listen } from '@kui-shell/core/webapp/cli'
import { inBrowser } from '@kui-shell/core/core/capabilities'
import { CapabilityRegistration } from '@kui-shell/core/models/plugin'
import { InputWrapper } from './src-web/components/InputWrapper'

// Register searchBarWrapper
const registerCapability: CapabilityRegistration = async () => {
  // Get user token from browser
  if (inBrowser()) {
    fetch('/multicloud/search').then((page) => page.text()).then((data) => {
      const dom = new DOMParser().parseFromString(data, 'text/html')
      const access = dom.querySelector('#app-access')
      document.querySelector('body').appendChild(access)
    })
  }
  const stripe: HTMLElement = document.querySelector('.kui--input-stripe')
  await InputWrapper(stripe)

  // Core by default listens to original input bar
  // We need to override that listen to the hijacked input bar by default
  const prompt: HTMLInputElement = document.querySelector('.repl-block .repl-input input')
  listen(prompt)
}

export default registerCapability

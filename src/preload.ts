/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CapabilityRegistration } from '@kui-shell/core/models/plugin'
import { InputWrapper } from './src-web/components/InputWrapper'

// Register searchBarWrapper

export const registerCapability: CapabilityRegistration = async () => {
    const stripe: HTMLElement = document.querySelector('.kui--input-stripe')
    await InputWrapper(stripe)
  }
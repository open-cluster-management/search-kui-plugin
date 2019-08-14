/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { injectCSS } from '@kui-shell/core/webapp/util/inject'

export const injectOurCSS = () => {
  injectCSS(
    {
      key: 'search',
      path: '/kui/plugin-search.css',
    },
  )
}

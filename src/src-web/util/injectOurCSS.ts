/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { injectCSS } from '@kui-shell/core'

export const injectOurCSS = (env?) => {
  try {
    if (env === 'test') { // TODO: Find a way to import/require css file for jest testing.
      return {
        css: '@kui-shell/plugin-search/mdist/src-web/styles/index.css',
        key: 'search'
      }
    } else {
      injectCSS({
        css: require('@kui-shell/plugin-search/mdist/src-web/styles/index.css'),
        key: 'search'
      })
    }
  } catch (err) {
    return err
  }
}
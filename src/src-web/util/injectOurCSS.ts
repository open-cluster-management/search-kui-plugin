/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { dirname, join } from 'path'

export const injectOurCSS = () => {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-search/package.json'))
    injectCSS(
        {
          key: "carbon",
          path: join(ourRoot, 'src/src-web/styles/index.css')
        }
      )
}
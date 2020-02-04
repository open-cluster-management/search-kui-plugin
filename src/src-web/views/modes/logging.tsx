/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { Badge } from '@kui-shell/core';
import * as lodash from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import strings from '../../util/i18n'
import Logger from '../../components/Logger'

/**
 * Render resource's log list
 *
 */
export const buildLog = (data: any) => new Promise((resolve, reject) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add('bx--structured-list--summary')

  const containers = lodash.get(data, 'container', '').replace(/,/g, '').split(' ')

  const logger = () => {
    return(
      <Logger
        data={data}
        items={containers}
      />
    )
  }

  ReactDOM.render(React.createElement(logger), node)
  resolve(node)
})

/**
 * Render resource's logs tab
 *
 */
export const logTab = (data: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = data.name.split(/(-[0-9])/)
  badges.push(balloon[0])

  return {
    mode: 'logging',
    label: strings('search.label.logs'),
    order: 3,
    content: buildLog(data)
  }

  // return{
  //   type: 'custom',
  //   isEntity: true,
  //   content: buildLog(data),
  //   viewName: data.kind,
  //   name: data.name,
  //   packageName: lodash.get(data, 'namespace', ''),
  //   badges,
  //   modes: [
  //     {
  //       defaultMode: true,
  //       mode: 'logging',
  //       direct: () => logTab(data),
  //       leaveBottomStripeAlone: true,
  //       label: strings('search.label.logs'),
  //     },
  //   ]
  // }
}

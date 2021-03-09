/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import * as lodash from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import strings from '../../util/i18n'
import Logger from '../../components/Logger'

/**
 * Render resource's log list
 *
 */
export const buildLog = (data: any) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add('bx--structured-list--summary')

  const containers = lodash.get(data, 'container', '').replace(/,/g, '').split(' ')
  const logger = () => {
    return (
      <Logger
        data={data}
        items={containers}
      />
    )
  }

  ReactDOM.render(React.createElement(logger), node)
  return node
}

/**
 * Render resource's logs tab
 *
 */
export const logTab = (data: any) => {
  return {
    mode: 'logging',
    label: strings('search.label.logs'),
    order: 3,
    content: buildLog(data)
  }
}

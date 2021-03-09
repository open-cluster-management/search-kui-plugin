/*******************************************************************************
* 
* Copyright (c) 2020 Red Hat, Inc.
* 
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

import * as lodash from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { StructuredListWrapper, StructuredListBody, StructuredListRow, StructuredListCell } from 'carbon-components-react'
import strings from '../../util/i18n'

/**
 * Render resource's summary list
 *
 */
export const buildSummary = (items: any) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add('bx--structured-list--summary')

  // Filter out items that being with an underscore
  const rows = Object.entries(items).filter((key) => !key[0][0].match('_'))

  const summary = () => {
    return(
      <StructuredListWrapper>
        <StructuredListBody>
          {rows.map((row) => (
            <StructuredListRow key={lodash.get(row, '[0]', '')}>
              <StructuredListCell>
                <span className='bx--structured-list-td-header'>{`${row[0]}`}</span>
                  <br></br>
                <span className='bx--structured-list-td-body'>{`${row[1]}`}</span>
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    )
  }
  ReactDOM.render(React.createElement(summary), node)

  return node
}

/**
 * Render resource's summary tab
 *
 */
export const summaryTab = (items: any) => {
  return {
    mode: 'summaryTab',
    defaultMode: true,
    label: strings('search.label.summary'),
    order: 1,
    content: buildSummary(items),
  }
}

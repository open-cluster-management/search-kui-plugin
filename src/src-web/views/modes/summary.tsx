/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { Badge } from '@kui-shell/core/webapp/views/sidecar';
import * as lodash from 'lodash'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

/**
 * Render resource's summary list
 * 
 */
export const buildSummary = (items: any) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add('bx--structured-list--summary')

  // Filter out items that being with an underscore
  const row = Object.entries(items).filter((key) => !key[0][0].match("_"))

  const summary = () => {
    return(
      <section className="bx--structured-list">
        <div className="bx--structured-list-tbody">
          {
            row.map((cell) => (
              <div className="bx--structured-list-row" key={`${cell[0]}`}>
                <div className="bx--structured-list-td bx--structured-list-content--wrap">
                  <span className="bx--structured-list-td-header">{`${cell[0]}`}</span>
                  <br></br>
                  <span className="bx--structured-list-td-body">{`${cell[1]}`}</span>
                </div>
              </div>
            ))
          }
        </div>
      </section>
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
  const badges: Badge[] = []
  
  // This will allow the sidecar balloon element to display the resources name.
  const balloon = items.name.toString().split(/(-[0-9])/)
  badges.push(balloon[0])

  return{
    type: 'custom',
    isEntity: true,
    content: buildSummary(items),
    contentType: 'json',
    viewName: `${items.kind}`,
    name: `${items.name}`,
    packageName: `${lodash.get(items, 'namespace', '')}`,
    badges,
    modes: [
      {
        defaultMode: true, 
        mode: 'summary',
        direct: () => summaryTab(items),
        leaveBottomStripeAlone: true,
        label: 'Summary'
      },
    ]
  }
}

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
import { StructuredListWrapper, StructuredListBody, StructuredListRow, StructuredListCell, ClickableTile } from 'carbon-components-react'
import { getCurrentTab } from '@kui-shell/core'
import strings from '../../util/i18n'

const handleEvent = (resource, cluster?, event?) => {
  if ((event && event.which === 13) || !event) {
    let command = `search kind:${lodash.get(resource, 'kind', '')} `

    if (cluster && lodash.get(resource, 'kind', '') !== 'cluster') { // Include cluster name when returning the related data.
      command += `cluster:${cluster} name:`
    } else {
      command += 'name:'
    }

    lodash.get(resource, 'items', '').forEach((item) => {
      command += `${item.name},`
    })
    getCurrentTab().REPL.pexec(command.substring(0, command.length - 1))
  }
}

/**
 * Renders a structured list of related resources for the selected resource's sidecar.
 * @param related
 */
export const buildRelated = (data: any, type?: string) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add(type !== 'query' ? 'bx--structured-list--summary' : 'bx--tile-related')

  const cluster = lodash.get(data, 'items[0].cluster', '')

  const relatedResource = type !== 'query'
  ? () => {
    return(
      <StructuredListWrapper>
        <StructuredListBody>
          {data.map((row) => (
            <StructuredListRow key={`${row.kind}`} className='bx--structured-list-rowclick'>
              <StructuredListCell tabIndex={0} onKeyPress={(e) => handleEvent(row, cluster, e)} onClick={() => handleEvent(row, cluster)}>
              <span className='bx--structured-list-td-related-header'>{`${row.items.length}`}</span>
                  <br></br>
              <span className='bx--structured-list-td-body'>{`Related ${row.kind}`}</span>
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    )
  }
  : () => {
    return(
      data.map((row) => (
        <ClickableTile tabIndex={0} onKeyPress={(e) => handleEvent(row, cluster, e)} key={row.kind} handleClick={() => handleEvent(row, cluster)}>
          <div className='bx--tile-container'>
            <span className='bx--structured-list-td-related-header'>{`${row.items.length}`}</span>
                <br></br>
            <span className='bx--structured-list-td-body'>{`Related ${row.kind}`}</span>
          </div>
        </ClickableTile>
      ))
    )
  }

  ReactDOM.render(React.createElement(relatedResource), node)
  return node
}

/**
 * Renders a related tab for the selected resource's || search query's sidecar.
 * @param resource
 * @param type
 */
export const relatedTab = (data: any, type?: string) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = lodash.get(data, 'items[0].name', '').split(/(-[0-9])/)
  badges.push(balloon[0])

  return {
    mode: 'related',
    label: strings('search.label.related'),
    order: 9999,
    content: buildRelated(data.related, type)
  }
}

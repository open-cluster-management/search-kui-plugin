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

/**
 * Renders a structured list of related resources for the selected resource's sidecar.
 * @param related
 */
export const buildRelated = (related: any, type?: string) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add(type !== 'query' ? 'bx--structured-list--summary' : 'bx--tile-related')

  const relatedResource = type !== 'query'
  ? () => {
    return(
      <StructuredListWrapper>
        <StructuredListBody>
          {related.map(row => (
            <StructuredListRow key={`${row.kind}`} className='bx--structured-list-rowclick'>
              <StructuredListCell onClick={() => {
                const results = related.filter((r) => r.kind.includes(row.kind))
                let command = `search kind:${row.kind} name:`

                results[0].items.forEach((element) => {
                  command += `${element.name},`
                });

                getCurrentTab().REPL.pexec(command.substring(0, command.length - 1))
              }}>
              <span className='bx--structured-list-td-related-header'>{`${row.count}`}</span>
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
      related.map(row => (
        <ClickableTile key={row.kind} handleClick={() => {
          const results = related.filter((r) => r.kind.includes(row.kind))
          let command = `search kind:${row.kind} name:`

          results[0].items.forEach((element) => {
            command += `${element.name},`
          });

            getCurrentTab().REPL.pexec(command.substring(0, command.length - 1))
          }}>
          <div className='bx--tile-container'>
            <span className='bx--structured-list-td-related-header'>{`${row.count}`}</span>
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

  // return{
  //   type: 'custom',
  //   isEntity: true,
  //   content: buildRelated(data.related, type),
  //   badges: type !== 'query' ? badges : null,
  //   viewName: lodash.get(data, 'items[0].kind', ''),
  //   name: type !== 'query' ? lodash.get(data, 'items[0].name', '') : strings('search.label.query', [lodash.get(data, 'items[0].kind', '')]),
  //   packageName: type !== 'query' ? lodash.get(data, 'items[0].namespace', '') : null,
  //   modes: [
  //     {
  //       defaultMode: true,
  //       mode: 'related',
  //       direct: () => relatedTab(data, type),
  //       leaveBottomStripeAlone: true,
  //       label: strings('search.label.related')
  //     },
  //   ]
  // }
}

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command';
import { convertStringToQuery } from '../../util/search-helper'
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import RelatedTable from '../../components/RelatedTable';
import HTTPClient from '../../controller/HTTPClient';
import { SEARCH_RELATED_QUERY } from '../../definitions/search-queries';

/**
 * Render the tabular Related view
 */
export const renderRelated = (data: any[], node: HTMLDivElement, command: any) => {
  const uniqueKinds = [...new Set(data.map((item) => item.kind))] // returns unique kinds from the data <-> creates an array of strings
  const count = data.map((item) => item.count)

  const relatedResource = data.length !== 0 ? () => {
    return (
      <div className={'related--resource'}>
        <RelatedTable
          items={data}
          kind={uniqueKinds}
          count={count}
          filter={command}
        />
      </div>
     )
  }
  : () => {
    return (
      <div className={'related--resource'}>
        <table className={'bx--data-table bx--data-table--no-border'}>
          <tbody>
            <tr className={'bx--data-table--related'}>
              <td>
                {'Results for Related Resources'}
              </td>
              <td>
                {'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  ReactDOM.render(React.createElement(relatedResource), node)
  return node
}

/**
 * Render a related table and show it in the sidecar
 */
export const renderAndViewRelated = (args: EvaluatorArgs) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  const buildRelated = (items: object[], command?: any) => {
    const node = document.createElement('div', {is: 'search-sidecar-related'})
    node.classList.add('search-kui-plugin')
    renderRelated(items, node, command)
    return node
  }

  HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      resolve(buildRelated(res.data.searchResult[0].related, userQuery))
    })
})

export default async (commandTree: CommandRegistrar) => {
  const opts = { noAuthOk: true, inBrowserOk: true }
  await commandTree.listen('/search/related', renderAndViewRelated, opts)
}

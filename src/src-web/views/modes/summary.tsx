/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { convertStringToQuery } from '../../util/search-helper';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { CommandRegistrar } from '@kui-shell/core/models/command';
import HTTPClient from '../../controller/HTTPClient';
import { SEARCH_QUERY } from '../../definitions/search-queries';

/**
 * Render resource's summary
 */
export const renderSummary = (data: object[], node: HTMLDivElement) => {
  const summaryResource = () => {
    return (
      <div>
        <pre className='pre-wrap'>
            <code className='language-yaml' data-content-type='language-yaml'>
                {`NAME: ${data[0]['name']}`}<br></br>
                {`KIND: ${data[0]['kind']}`}<br></br>
                {`CREATED: ${data[0]['created']}`}<br></br>
                {`SELFLINK: ${data[0]['selfLink']}`}<br></br>
            </code>
        </pre>
      </div>
    )
  }
  ReactDOM.render(React.createElement(summaryResource), node)
  return node
}

/**
 * Render summary and show it in the sidecar
 */
export const renderAndViewSummary = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  const buildSummary = (items: object[]) => {
    const node = document.createElement('div', {is: 'search-sidecar-summary'})
    node.classList.add('custom-content')
    renderSummary(items, node)
    return node
  }

  HTTPClient('post', 'search', SEARCH_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      resolve(buildSummary(res.data.searchResult[0].items))
    })
})

export default async (commandTree: CommandRegistrar) => {
  const opts = { noAuthOk: true, inBrowserOk: true }
  await commandTree.listen(`/search/summary`, renderAndViewSummary, opts)
}

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
import needle = require('needle');
import { convertStringToQuery } from '../../util/search-helper';
import * as jsYaml from 'js-yaml'
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { CommandRegistrar } from '@kui-shell/core/models/command';
import HTTPClient from '../../controller/HTTPClient';
import { SEARCH_MCM_QUERY, SEARCH_QUERY } from '../../definitions/search-queries';

const config = require('../../../lib/shared/config')

/**
 * Render resources yaml
 */
export const renderYAML = (data: object[], node: HTMLDivElement) => {
  const yamlResource = () => {
    return (
      <div className='scrollable scrollable-auto monospace'>
          <pre className='pre-wrap break-all'>
            <code className='language-yaml' data-content-type='language-yaml'>
                {jsYaml.safeDump(data)}
            </code>
          </pre>
      </div>
    )
  }
  ReactDOM.render(React.createElement(yamlResource), node)
  return node
}

/**
 * Render yaml and show it in the sidecar
 */
export const renderAndViewYAML = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  const buildYAML = (items: object[]) => {
    const node = document.createElement('div', {is: 'search-sidecar-yaml'})
    node.classList.add('custom-content')
    renderYAML(items, node)
    return node
  }

  HTTPClient('post', 'search', SEARCH_QUERY(userQuery.keywords, userQuery.filters))
  .then((res) => {
    const record = res.data.searchResult[0].items

    HTTPClient('post', 'mcm', SEARCH_MCM_QUERY(record))
    .then((resp) => {
      const resources = resp.data.getResource
      resolve(
        buildYAML(resources),
      )
    })
  })
})

export default async (commandTree: CommandRegistrar) => {
  const opts = { noAuthOk: true, inBrowserOk: true }
  await commandTree.listen(`/search/yaml`, renderAndViewYAML, opts)
}

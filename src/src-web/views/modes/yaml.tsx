/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as Debug from 'debug'

const debug = Debug('search/src/src-web/view/summary')
import needle = require('needle');
import { convertStringToQuery } from '../../util/search-helper';
import * as jsYaml from 'js-yaml'
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { CommandRegistrar } from '@kui-shell/core/models/command';

const config = require('../../../lib/shared/config')

/**
 * Render resources yaml
 * 
 */
export const renderYAML = (data: Array<object>, node: HTMLDivElement) => {
  const yamlResource = () => { 
    return (
      <div className="scrollable scrollable-auto">
        <pre>
          <code className="language-yaml" data-content-type="language-yaml">
            {
              jsYaml.safeDump(data)
            }
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
 * 
 */
export const renderAndViewYAML = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)
  const data = {
    operationName:"searchResult",
    variables:{
      input:[{"keywords":userQuery.keywords, "filters":userQuery.filters}]
    },
    query: "query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    __typename\n  }\n}\n"
  }

  const buildYAML = (items: Array<object>) => {
    const node = document.createElement('div', {is: 'search-sidecar-yaml'})
    node.classList.add('custom-content')
    renderYAML(items, node)
    return node
  }

  needle('post', config.SEARCH_API, data, config.options)
  .then(res => {
    const record = res.body.data.searchResult[0].items

    const data = {
      operationName:"getResource",
      variables:{
          kind:record[0]['kind'], 
          name:record[0]['name'],
          namespace:record[0]['namespace'],
          cluster:record[0]['cluster'],
          selfLink:record[0]['selfLink']
        },
      query: "query getResource($kind: String, $name: String, $namespace: String, $cluster: String, $selfLink: String) {\n  getResource(kind: $kind, name: $name, namespace: $namespace, cluster: $cluster, selfLink: $selfLink)\n}\n"    
    }

    needle('post', config.MCM_API, data, config.options)
    .then(resp => {
      const resources = resp.body.data.getResource
      resolve(
        buildYAML(resources)
      )
    })
  })
})

export default async (commandTree: CommandRegistrar) => {
  const opts = { noAuthOk: true, inBrowserOk: true }
  await commandTree.listen(`/search/yaml`, renderAndViewYAML, opts)
}
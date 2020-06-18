/* eslint-disable no-unused-expressions */
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { convertStringToQuery } from '../util/search-helper';
import * as lodash from 'lodash';
import HTTPClient from './HTTPClient';
import { SEARCH_ACM_QUERY, SEARCH_RELATED_QUERY, GET_CLUSTER } from '../definitions/search-queries';
import { summaryTab } from '../views/modes/summary';
import { yamlTab } from '../views/modes/yaml';
import { relatedTab } from '../views/modes/related';
import { logTab } from '../views/modes/logging';
import strings from '../util/i18n'
import { isSearchAvailable, renderSearchAvailable } from './search';
import { setPluginState, getPluginState } from '../pluginState';

export const buildSidecar = (type: string, data: any, resource?: any) => {
  const modes = []
  const kind = lodash.get(data, 'items[0].kind', '')

  if (type !== 'query') {
    modes.push(summaryTab(data.items[0]))

    // If the resource is a pod, add the logging tab.
    if (kind === 'pod') {
      modes.push(logTab(data.items[0]))
    }

    // If the sidecar was able to return a yaml object, add the YAML tab.
    if (!lodash.get(resource, 'errors', '') && lodash.get(data, 'getResource', '') === '' && kind !== 'cluster') {
      modes.push(yamlTab(resource))
    }
  }

  // If the resource have any related resources, add the related tab.
  if (lodash.get(data, 'related', '').length > 0) {
    modes.push(relatedTab(data, type))
  }

  // Returns the sidecar and tab for the selected resource || search query that was entered.
  return {
    kind,
    metadata: {
      name: type !== 'query' ? lodash.get(data, 'items[0].name', '') : strings('search.label.query', [kind]),
      namespace: type !== 'query' ? lodash.get(data, 'items[0].namespace', '') : null,
    },
    modes,
  }
}

export const getSidecar = async (args) => new Promise((resolve) => {
  const { command } = args
  const userQuery = convertStringToQuery(command)

  if (args.argv.length === 2) {
    resolve(`ERROR: Received wrong number of parameters.\nUSAGE: ${command} kind:<keyword> name:<keyword>\nEXAMPLE: ${command} kind:pod name:alertmanager-main-0`)
  }

  const node = document.createElement('pre')
  node.setAttribute('class', 'oops')
  node.innerText = strings('search.no.resources.found')

  if (isSearchAvailable()) {
    HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      const data = lodash.get(res, 'data.searchResult[0]', '')
      const kind = lodash.get(data, 'items[0].kind', '')

      if (!data || data.items.length === 0) {
        resolve(node)
      } else if (args.command.includes('related:resources')) {
        resolve(buildSidecar('query', data))
      } else {
        HTTPClient('post', 'console', kind !== 'cluster' ? SEARCH_ACM_QUERY(data.items[0]) : GET_CLUSTER())
        .then((resp) => {
          let resource

          if (kind === 'cliuster') {
            resource = resp.data.items.filter((cluster) => cluster.metadata.name === data.items[0].name)
          } else {
            resource = !resp.errors ? resp.data.getResource : resp
          }

          resolve(buildSidecar('resource', data, resource))
        })
        .catch((err) => {
          setPluginState('error', err)
          resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
        })
      }
    })
    .catch((err) => {
      setPluginState('error', err)
      resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
    })
  } else {
    resolve(renderSearchAvailable(isSearchAvailable()))
  }
})

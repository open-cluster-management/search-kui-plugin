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
import { Badge } from '@kui-shell/core';
import * as lodash from 'lodash';
import HTTPClient from './HTTPClient';
import { SEARCH_ACM_QUERY, SEARCH_RELATED_QUERY } from '../definitions/search-queries';
import { summaryTab, buildSummary } from '../views/modes/summary';
import { yamlTab } from '../views/modes/yaml';
import { relatedTab, buildRelated } from '../views/modes/related';
import { logTab } from '../views/modes/logging';
import strings from '../../src-web/util/i18n'
import { isSearchAvailable, renderSearchAvailable } from './search';
import { setPluginState, getPluginState } from '../../pluginState';

export const buildSidecar = (type: string, data: any, resource?: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = lodash.get(data, 'items[0].name', '').split(/(-[0-9])/)
  badges.push(balloon[0])

  const modes = []

  if (type !== 'query') {
    // If the resource is a pod, add the logging tab.
    if (lodash.get(data, 'items[0].kind', '') === 'pod') {
      modes.push(logTab(data.items[0]))
    }

    // If the sidecar was able to return a yaml object, add the YAML tab.
    if (!lodash.get(resource, 'errors', '') && lodash.get(data, 'getResource', '') === '') {
      modes.push(yamlTab(resource))
    }
  }

  // If the resource have any related resources, add the related tab. (For now, we're removing this tab from the query's sidecar and using the summary tab to represent this one.)
  if (lodash.get(data, 'related', '').length > 0 && type !== 'query') {
    modes.push(relatedTab(data, type))
  }

  // Returns the sidecar and tab for the selected resource || search query that was entered.
  return {
    apiVersion: 'mcm.ibm.com/v1', // TODO: check if a different API version is needed
    badges: type !== 'query' ? badges : null,
    kind: lodash.get(data, 'items[0].kind', ''),
    summary: type !== 'query' ? buildSummary(data.items[0]) : buildRelated(data.related, type),
    metadata: {
      name: type !== 'query' ? lodash.get(data, 'items[0].name', '') : strings('search.label.query', [lodash.get(data, 'items[0].kind', '')]),
      namespace: type !== 'query' ? lodash.get(data, 'items[0].namespace', '') : null,
    },
    modes,
  }
}

export const getSidecar = async (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length === 2) {
    resolve(`ERROR: Received wrong number of parameters.\nUSAGE: ${args.command} kind:<keyword> name:<keyword> namespace:<keyword>\nEXAMPLE: ${args.command} kind:pod name:audit-logging-fluentd-ds-7tpnw namespace:kube-system`)
  }

  const node = document.createElement('pre')
  node.setAttribute('class', 'oops')
  node.innerText = strings('search.no.resources.found')

  if (isSearchAvailable()) {
    HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      const data = lodash.get(res, 'data.searchResult[0]', '')

      if (!data || data.items.length === 0) {
        resolve(node)
      } else if (args.command.includes('related:resources')) {
        resolve(buildSidecar('query', data))
      } else {
        HTTPClient('post', 'acm', SEARCH_ACM_QUERY(data.items[0]))
        .then((resp) => {
          const resource = !resp.errors ? resp.data.getResource : resp
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

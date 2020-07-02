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

import { convertStringToQuery } from '../util/search-helper';
import * as lodash from 'lodash';
import HTTPClient from './HTTPClient';
import { SEARCH_ACM_QUERY, SEARCH_RELATED_QUERY, GET_CLUSTER } from '../definitions/search-queries';
import { summaryTab } from '../views/modes/summary';
import { yamlTab } from '../views/modes/yaml';
import { relatedTab } from '../views/modes/related';
import { logTab } from '../views/modes/logging';
import strings from '../util/i18n'
import { renderSearchAvailable } from './search';
import { setPluginState, getPluginState, resourceNotFound } from '../pluginState';
import { usage } from './helpfiles/searchhelp';

import  { MultiModalResponse } from '@kui-shell/core'
import '../../web/scss/sidecar.scss'

/**
 * Build sidecar view tabs for resources.
 * @param type
 * @param data
 * @param resource
 */
export const buildSidecar = (type: string, data: any, resource?: any, cmd?: any) => {
  const modes = []
  const kind = lodash.get(data, 'items[0].kind', '')

  if (type !== 'query') {
    // Add summary tab
    modes.push(summaryTab(data.items[0]))

    // If the resource is a pod, add the logging tab.
    if (kind === 'pod') {
      modes.push(logTab(data.items[0]))
    }

    // If the sidecar was able to return a yaml object, add the YAML tab. (For cluster resource, use metadata for YAML)
    if (kind === 'cluster' && lodash.get(resource, '[0].metadata', '')) {
      modes.push(yamlTab(resource))
    } else if (!lodash.get(resource, 'errors', '') && lodash.get(data, 'getResource', '') === '') {
      modes.push(yamlTab(resource, data, cmd))
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

/**
 * Get sidecar view for targeted resource
 * @param args
 */
export const getSidecar = async (args) => new Promise((resolve) => {
  const { command, argv } = args
  const userQuery = convertStringToQuery(command)

  if (argv.length === 2 || getPluginState().flags.includes(argv[2])) { // Help menu will execute if command is (search summary || search summary -[flag])
    resolve(usage(argv))
  }

  HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
  .then((res) => {
    const data = lodash.get(res, 'data.searchResult[0]', '')
    const kind = lodash.get(data, 'items[0].kind',  '')

    if (!data || data.items.length === 0 && data.related.length === 0) {
      resolve(resourceNotFound())
    }

    const query = { default: SEARCH_ACM_QUERY(data.items[0]), cluster: GET_CLUSTER() }

    if (args.command.includes('--related')) {
      resolve(buildSidecar('query', data))
    } else {
      HTTPClient('post', 'console', kind !== 'cluster' ? query['default'] : query['cluster'])
      .then((resp) => {
        let resource

        if (kind === 'cluster') {
          resource = resp.data.items.filter((cluster) => cluster.metadata.name === data.items[0].name)
        } else {
          resource = !resp.errors ? resp.data.getResource : resp
        }

        resolve(buildSidecar('resource', data, resource, command))
      })
      .catch((err) => {
        setPluginState('error', err)
        resolve(renderSearchAvailable())
      })
    }
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable())
  })
})

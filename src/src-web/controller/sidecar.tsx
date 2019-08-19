/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { convertStringToQuery } from '../util/search-helper';
import { Badge } from '@kui-shell/core/webapp/views/sidecar'
import * as lodash from 'lodash'
import * as jsYaml from 'js-yaml'
import HTTPClient from './HTTPClient';
import { SEARCH_QUERY, SEARCH_MCM_QUERY, SEARCH_RELATED_QUERY } from '../definitions/search-queries';
import { summaryTab } from '../views/modes/summary'
import { yamlTab } from '../views/modes/yaml'
import { relatedTab } from '../views/modes/related';

const buildSidecar = (resource: any, related?: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = resource.kind !== 'release' ? lodash.get(resource.metadata.labels, 'app', resource.metadata.name) : resource.name
  badges.push(balloon)

  // Sidecar was able to return summary, yaml, and related objects
  if (resource.kind !== 'release'){
    return {
      type: 'custom',
      isEntity: true,
      content: jsYaml.safeDump(resource.metadata),
      contentType: 'json',
      badges,
      viewName: `${resource.kind}`,
      name: `${resource.metadata.name}`,
      packageName: `${lodash.get(resource.metadata, 'namespace', '')}`,
      modes: [
        {
          defaultMode: true, 
          mode: 'summary',
          direct: () => summaryTab(resource),
          leaveBottomStripeAlone: true,
          label: 'Summary'
        },
        {
          defaultMode: true, 
          mode: 'yaml',
          direct: () => yamlTab(resource),
          leaveBottomStripeAlone: true,
          label: 'YAML'
        },
        {
          defaultMode: true, 
          mode: 'related',
          direct: () => relatedTab(related),
          leaveBottomStripeAlone: true,
          label: 'Related Resources'
        },
      ]
    }
  }

  // Sidecar was only able to return summary value.
  else{
    return {
      type: 'custom',
      isEntity: true,
      content: jsYaml.safeDump(resource),
      contentType: 'json',
      badges,
      viewName: `${resource.kind}`,
      name: `${resource.name}`,
      packageName: `${lodash.get(resource, 'namespace', '')}`,
      modes: [
        {
          defaultMode: true, 
          mode: 'summary',
          direct: () => summaryTab(resource),
          leaveBottomStripeAlone: true,
          label: 'Summary'
        },
      ]
    }
  }
}

export const getSidecar = async (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length === 2){
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search summary kind:<keyword> name:<keyword> namespace:<keyword>\nEXAMPLE: search kind:pod name:audit-logging-fluentd-ds-7tpnw namespace:kube-system')
  }
  
  HTTPClient('post', 'search', SEARCH_QUERY(userQuery.keywords, userQuery.filters))
  .then(res => {
    const items = res.data.searchResult[0].items

    HTTPClient('post', 'mcm', SEARCH_MCM_QUERY(items))
    .then(resp => {      
      const resource = resp.data.getResource
      if(resource === null || resource === undefined)
        resolve(buildSidecar(items[0]))
      
      HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
      .then(res => {
        const related = res.data.searchResult[0].related
        resolve(buildSidecar(resource, related))
      })
    })
  })
})

const buildRelatedSidecar = (related: any, command: any) => {
  const userQuery = convertStringToQuery(command)
  const kind = lodash.get(userQuery.filters, '[0].values', '')

  return {
    type: 'custom',
    isEntity: true,
    name: `Related resources for search results: ${kind}`,
    viewName: `${kind}`,
    contentType: 'json',
    modes: [
      {
        defaultMode: true, 
        mode: 'related',
        direct: () => relatedTab(related),
        leaveBottomStripeAlone: true,
        label: 'Related Resources'
      },
    ],
    content: relatedTab(related)
  }
}

export const getRelatedSidecar = async (args) => new Promise((resolve, reject) => {
  if (args.argv.length === 2){
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search related:resources kind:<keyword>\nEXAMPLE: search related:resources kind:pod')
  }

  const userQuery = convertStringToQuery(args.command)
  
  HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
  .then(res => {
    const related = res.data.searchResult[0].related
    resolve(buildRelatedSidecar(related, args.command))
  })  
})
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
import HTTPClient from './HTTPClient';
import { SEARCH_QUERY, SEARCH_MCM_QUERY, SEARCH_RELATED_QUERY } from '../definitions/search-queries';
import { summaryTab, buildSummary } from '../views/modes/summary'
import { yamlTab } from '../views/modes/yaml'
import { relatedTab } from '../views/modes/related';

const buildSidecar = (items: any, resource?: any, related?: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = items.name.split(/(-[0-9])/)
  badges.push(balloon[0])

  const modes = [
    {
      defaultMode: true, 
      mode: 'summary',
      direct: () => summaryTab(items),
      leaveBottomStripeAlone: true,
      label: 'Summary',
      order: 1
    },
    {
      defaultMode: true, 
      mode: 'related',
      direct: () => relatedTab(related),
      leaveBottomStripeAlone: true,
      label: 'Related Resources',
      order: 3
    },
    {
      defaultMode: true, 
      mode: 'yaml',
      direct: () => yamlTab(resource),
      leaveBottomStripeAlone: true,
      label: 'YAML',
      order: 2
    },
  ]

  // If the sidecar was not able to return a yaml object, remove the YAML tab.
  if(resource.message){
    modes.pop()
  }

  // Sidecar was able to return summary, yaml, and related objects.
  if (resource !== undefined){
    return {
      type: 'custom',
      isEntity: true,
      content: buildSummary(items),
      contentType: 'json',
      badges,
      viewName: `${items.kind}`,
      name: `${items.name}`,
      packageName: `${lodash.get(items, 'namespace', '')}`,
      modes
    }
  }

  // Sidecar was only able to return summary and related objects.
  else{
    return {
      type: 'custom',
      isEntity: true,
      content: buildSummary(items),
      contentType: 'json',
      badges,
      viewName: `${items.kind}`,
      name: `${items.name}`,
      packageName: `${lodash.get(items, 'namespace', '')}`,
      modes: [
        {
          defaultMode: true, 
          mode: 'summary',
          direct: () => summaryTab(items),
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
      const resource = resp.data.getResource[0] ? resp.data.getResource[0] : resp.data.getResource
      
      HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
      .then(res => {
        const related = res.data.searchResult[0].related
        resolve(buildSidecar(items[0], resource, related))
      })
    })
  })
})

export const buildRelatedSidecar = (related: any, command: any) => {
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

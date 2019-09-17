/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { convertStringToQuery } from '../util/search-helper';
import { Badge } from '@kui-shell/core/webapp/views/sidecar';
import * as lodash from 'lodash';
import HTTPClient from './HTTPClient';
import { SEARCH_MCM_QUERY, SEARCH_RELATED_QUERY } from '../definitions/search-queries';
import { summaryTab, buildSummary } from '../views/modes/summary';
import { yamlTab } from '../views/modes/yaml';
import { relatedTab, queryRelatedTab, buildQueryRelated } from '../views/modes/related';
import strings from '../../src-web/util/i18n'

export const buildSidecar = (type: string, data: any, resource?: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = lodash.get(data, 'items[0].name', '').split(/(-[0-9])/)
  badges.push(balloon[0])

  // Returns the related resources sidecar and tab for the search query that was entered.
  if(type === 'query'){
    return{
      type: 'custom',
      isEntity: true,
      name: strings('search.label.query', [lodash.get(data, 'items[0].kind', '')]),
      viewName: `${lodash.get(data, 'items[0].kind', '')}`,
      modes: [
        {
          defaultMode: true,
          mode: 'related',
          direct: () => queryRelatedTab(data),
          leaveBottomStripeAlone: true,
          label: strings('search.label.related'),
        }
      ],
      content: buildQueryRelated(data.related)
    }
  }

  // Returns the sidecar summary, yaml, and related resources tab for the selected table resource.
  else{
    const modes = [
      {
        defaultMode: true,
        mode: 'summary',
        direct: () => summaryTab(data.items[0]),
        leaveBottomStripeAlone: true,
        label: strings('search.label.summary'),
        order: 1
      },
      {
        defaultMode: true,
        mode: 'related',
        direct: () => relatedTab(data),
        leaveBottomStripeAlone: true,
        label: strings('search.label.related'),
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
    if(resource.message || resource.errors){
      modes.pop()
    }
  
    // Return sidecar entity
    return {
      type: 'custom',
      isEntity: true,
      content: buildSummary(data.items[0]),
      contentType: 'json',
      badges,
      viewName: `${lodash.get(data, 'items[0].kind', '')}`,
      name: `${lodash.get(data, 'items[0].name', '')}`,
      packageName: `${lodash.get(data, 'items[0].namespace', '')}`,
      modes
    }
  }
}

export const getSidecar = async (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length === 2){
    resolve(`ERROR: Received wrong number of parameters.\nUSAGE: ${args.command} kind:<keyword> name:<keyword> namespace:<keyword>\nEXAMPLE: ${args.command} kind:pod name:audit-logging-fluentd-ds-7tpnw namespace:kube-system`)
  }

  const node = document.createElement('pre')
  node.setAttribute('class', 'oops')
  node.innerText = strings('search.no.resources.found')
  
  HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
  .then(res => {
    const data = lodash.get(res, 'data.searchResult[0]', '')

    !data || data.count === 0
    ? resolve(node)
    : args.command.includes("related:resources") 

      ? resolve(buildSidecar('query', data))
      : HTTPClient('post', 'mcm', SEARCH_MCM_QUERY(data.items[0]))
        .then(resp => {
          const resource = !resp.errors ? resp.data.getResource : resp
          resolve(buildSidecar('resource', data, resource))
        })
  })
})

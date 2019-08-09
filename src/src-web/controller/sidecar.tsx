/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { EvaluatorArgs } from '@kui-shell/core/models/command'
import { renderAndViewSummary } from '../views/modes/summary';
import { convertStringToQuery } from '../util/search-helper';
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe';
import { Badge } from '@kui-shell/core/webapp/views/sidecar'
import * as lodash from 'lodash'
import { renderAndViewRelated } from '../views/modes/related';
import { renderAndViewYAML } from '../views/modes/yaml';

export const getSidecar = async (args: EvaluatorArgs) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length == 1)
    return 'ERROR: Received wrong number of parameters.\nUSAGE: search summary <kind> <resource>\nEXAMPLE: search summary ingress web-terminal'

  const kind = lodash.get(userQuery.filters, '[0].values', '')
  const name = lodash.get(userQuery.filters, '[1].values', '')
  const ns = lodash.get(userQuery.filters, '[2].values', '')

  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = name.toString().split(/(-[0-9])/)
  badges.push(balloon[0])

  const modes: SidecarMode[] = [
    {
      defaultMode: true,
      mode: 'summary',
      direct: `search summary kind:${kind} name:${name} ${ (ns && ns!=='') ? `namespace:${ns}` : ''}`,
      label: 'Summary',
      order: 1,
      leaveBottomStripeAlone: true
    },
    {
      defaultMode: true,
      mode: 'YAML',
      direct: `search yaml kind:${kind} name:${name} ${ (ns && ns!=='') ? `namespace:${ns}` : ''}`,
      label: 'YAML',
      order: 2,
      leaveBottomStripeAlone: true
    },
    {
      defaultMode: true,
      mode: 'related',
      direct: `search related kind:${kind} name:${name} namespace:${ns}`,
      label: 'Related Resources',
      order: 3,
      leaveBottomStripeAlone: true
    },
  ]

  const record = {
    type: 'custom',
    isEntity: true,
    name: `${name}`,
    packageName: `${ns}`,
    viewName: `${kind}`,
    modes,
    badges: badges,
    resource: renderAndViewYAML(args), 
    content: renderAndViewSummary(args),
  }
  return record
}

export const getRelatedSidecar = async (args: EvaluatorArgs) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length == 1)
    return 'ERROR: Received wrong number of parameters.\nUSAGE: search summary <kind> <resource>\nEXAMPLE: search summary ingress web-terminal'

  const kind = lodash.get(userQuery.filters, '[0].values', '')
  const modes: SidecarMode[] = [
    {
      defaultMode: true,
      mode: 'related',
      direct: args.command,
      label: `Related Resources`,
      leaveBottomStripeAlone: true
    },
  ]
  const record = {
    type: 'custom',
    isEntity: true,
    name: `Related resources for search results: ${kind}`,
    viewName: `${kind}`,
    contentType: 'json',
    modes,
    content: renderAndViewRelated(args),
  }
  return record
}
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'
import { renderAndViewYAML } from '../views/modes/yaml';
import { convertStringToQuery } from '../util/search-helper';
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe';
import * as lodash from 'lodash'

export const getSidecar = async (args: EvaluatorArgs) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length == 1)
    return 'ERROR: Received wrong number of parameters.\nUSAGE: search summary <kind> <resource>\nEXAMPLE: search summary ingress web-terminal'

  const kind = lodash.get(userQuery.filters, '[0].values', '')
  const name = lodash.get(userQuery.filters, '[1].values', '')
  const ns = lodash.get(userQuery.filters, '[2].values', '')

  const modes: SidecarMode[] = [
    {
      defaultMode: true,
      mode: 'YAML',
      direct: `search summary kind:${kind} name:${name} ${ (ns && ns!=='') ? `namespace:${ns}` : ''}`,
      label: 'YAML',
    },
    {
      mode: 'related',
      direct: `search related kind:${kind} name:${name} namespace:${ns}`,
      label: 'Related Resources',
    }
  ]

  const record = {
    type: 'custom',
    isEntity: true,
    viewName: `${kind}`,
    packageName: `${ns}`,
    name: `${name}`,
    contentType: 'json',
    modes,
    content: renderAndViewYAML(args)
  }
  return record
}

export default async (commandTree: CommandRegistrar) => {
  const opts = { noAuthOk: true, inBrowserOk: true }
  await commandTree.listen('/search/summary', getSidecar, opts)
}

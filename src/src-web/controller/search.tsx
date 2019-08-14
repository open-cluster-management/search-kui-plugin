/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CommandRegistrar } from '@kui-shell/core/models/command'
import HTTPClient from './HTTPClient'
import renderReact from '../util/renderReact';
import { convertStringToQuery } from '../util/search-helper'
import { toplevel as usage } from '../../usage'
import { SEARCH_QUERY } from '../definitions/search-queries'
import { getRelatedSidecar, getSidecar } from './sidecar';

const doSearch = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length === 1) {
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search <keyword>\nEXAMPLE: search aggregator')
  }

  const buildTable = (items: object[]) => {
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(items, node, args.command)
    return node
  }

  HTTPClient('post', 'search', SEARCH_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      resolve(
        buildTable(res.data.searchResult[0].items),
      )
    })
});

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  const opts = { usage, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/s`, doSearch, opts)
  commandTree.listen(`/search`, doSearch, opts)
  await commandTree.listen('/search/summary', getSidecar, opts)
  await commandTree.listen('/search/related:resources', getRelatedSidecar, opts)
}

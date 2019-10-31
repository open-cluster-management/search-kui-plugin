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
import { toplevel as usage } from './helpfiles/savedsearchhelp'
import { SEARCH_QUERY_COUNT, SAVED_SEARCH_QUERY } from '../definitions/search-queries'
import strings from '../../src-web/util/i18n'
import { isSearchAvailable, getSearchService } from './search';

function getQueryCount(searches) {
  const input = [...searches.map((query) => convertStringToQuery(query.searchText))]
  return HTTPClient('post', 'search', SEARCH_QUERY_COUNT(input))
    .then((res) => {
      return res.data.searchResult.map((query, idx) => {
        return {...query, kind: 'savedSearches', ...searches[idx]}
      })
    })
}

const doSavedSearch = (args) => new Promise((resolve, reject) => {
  const str = `${strings('validation.error')}:\t${strings('validation.savedsearches.parameters')}.\n\n${strings('validation.usage')}:\t${strings('validation.definition.savedsearches')}`

  if (args.argv.length > 1) {
    resolve(str)
  }

  const buildTable = async (data: any) => {
    // Get the search result for each saved query
    const results = await getQueryCount(data.items)
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(results, node, args.command)
    return node
  }

  const svc = getSearchService()
  svc.enabled && !svc.error
  ? HTTPClient('post', 'mcm', SAVED_SEARCH_QUERY)
    .then((res) => {
      resolve(
        buildTable(res.data),
      )
    })
    .catch((err) => {
      resolve(isSearchAvailable(false, err))
    })
  : resolve(isSearchAvailable(false))
})


/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  const opts = { usage, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/ss`, doSavedSearch, opts)
  commandTree.listen(`/savedsearches`, doSavedSearch, opts)
}

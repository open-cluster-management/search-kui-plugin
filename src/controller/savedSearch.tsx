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
// Copyright Contributors to the Open Cluster Management project

import { Registrar } from '@kui-shell/core'
import * as lodash from 'lodash'
import strings from '../util/i18n'
import HTTPClient from './HTTPClient'
import renderReact from '../util/renderReact';
import { convertStringToQuery } from '../util/search-helper'
import { usage } from './helpfiles/savedsearchhelp'
import { SEARCH_QUERY_COUNT, SAVED_SEARCH_QUERY } from '../definitions/search-queries'
import { renderSearchAvailable } from './search';
import { getPluginState, setPluginState, resourceNotFound } from '../pluginState';

export function getQueryCount(searches) {
  const input = [...searches.map((query) => convertStringToQuery(query.searchText))]
  return HTTPClient('post', 'search', SEARCH_QUERY_COUNT(input))
  .then((res) => {
    return res.data.searchResult.map((query, idx) => {
      return {...query, kind: 'savedSearches', ...searches[idx]}
    })
  })
}

export const doSavedSearch = (args) => new Promise((resolve) => {
  const { argv } = args
  const flags = getPluginState().flags

  if (flags.includes(argv[1])) { // Help menu for savedsearches command
    resolve(usage())
  } else if (argv.length > 1) {
    const str = `${strings('validation.error')}:\t${strings('validation.savedsearches.parameters')}.\n${strings('validation.usage')}:\t${strings('validation.definition.savedsearches')}`
    resolve(resourceNotFound(str))
  }

  const buildTable = async (data: any) => {
    // Get the search result for each saved query
    const results = await getQueryCount(data.items)
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(results, node, args.command)
    return node
  }

  HTTPClient('post', 'search', SAVED_SEARCH_QUERY)
  .then((res) => {
    const data = lodash.get(res, 'data', '')
    resolve(
      data.items.length > 0 ? buildTable(data) : resourceNotFound()
    )
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable())
  })
})

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: Registrar) => {
  const cmd = commandTree.listen(`/savedsearches`, doSavedSearch)
  commandTree.synonym('/ss', doSavedSearch, cmd)
}

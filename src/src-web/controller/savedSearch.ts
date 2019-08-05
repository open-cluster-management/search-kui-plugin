/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CommandRegistrar } from '@kui-shell/core/models/command'
import renderReact  from '../util/renderReact';
import { convertStringToQuery } from '../util/search-helper'
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { dirname, join } from 'path'
import * as needle from 'needle'

var config = require('../../lib/shared/config')

const injectOurCSS = () => {
  const ourRoot = dirname(require.resolve('@kui-shell/plugin-search/package.json'))
  injectCSS(
      {
        key: "carbon",
        path: join(ourRoot, 'src/src-web/styles/index.css')
      }
    )
}

function getQueryCount(searches) {
  const input = [...searches.map(query => convertStringToQuery(query.searchText))]
  return needle (
    'post',
    config.SEARCH_API,
    {
      operationName:"searchResult",
      variables:{
        input
      },
      query: "query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    count\n    __typename\n  }\n}\n"
    },
    config.options
  )
  .then(res => res.body.data.searchResult.map((query, idx) => { return { ...query, kind: 'savedSearches', ...searches[idx] }}))
  .catch(err => new Error(err))
}

const doSavedSearch = (args) => new Promise((resolve, reject) => {
  injectOurCSS();

  if (args.argv.length > 1){
    resolve('ERROR: Saved search query should not include any parameters.\nUSAGE: savedsearch (alias: ss)')
  }

  const data = {
    operationName:"userQueries",
    variables:{},
    query: "query userQueries {\n items: userQueries {\n name\n description\n searchText\n __typename\n}\n}\n"
  };

  const buildTable = async (items: Array<object>) => {
    // Get the search result for each saved query
    const results = await getQueryCount(items)
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(results, node)
    return node
  }

  needle('post', config.MCM_API, data, config.options)
   .then(res => {
      resolve (
        buildTable(res.body.data.items)
      )
   })
   .catch(err => reject(new Error(err)))
});


/**
 * Usage model for saved search query
 *
 */
const usage = {
  command: 'savedsearches',
  strict: 'savedsearches',
  title: 'List users saved searches',
  header: 'List users saved searches',
  example: 'savedsearches',
  optional: [
    { name: 'userQueries', positional: true }
  ]
}

const aliasUsage = {
  command: 'ss',
  strict: 'ss',
  title: 'List users saved searches',
  header: 'List users saved searches',
  example: 'ss',
  optional: [
    { name: 'userQueries', positional: true }
  ]
}

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  const opts = { usage, noAuthOk: true }
  const aliasOpts = { aliasUsage, noAuthOk: true }
  commandTree.listen(`/ss`, doSavedSearch, aliasOpts)
  commandTree.listen(`/savedsearches`, doSavedSearch, opts)
}
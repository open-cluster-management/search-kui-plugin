/*
 * Copyright 2019 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommandRegistrar } from '@kui-shell/core/models/command'
import renderReact from '../util/renderReact';
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { dirname, join } from 'path'
import { convertStringToQuery } from '../util/search-helper'
import { REPLServer } from 'repl';
import repl = require('@kui-shell/core/core/repl')
import * as needle from 'needle'

var config = require('../../lib/shared/config')

const doSearch = (args) => new Promise((resolve, reject) => {
  console.log('Running search.', args);
  const userQuery = convertStringToQuery(args.command)
  injectOurCSS();

  if (args.argv.length == 1){
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search <keyword>\nEXAMPLE: search aggregator')
  }

  const data = {
    operationName:"searchResult",
    variables:{
      input:[{"keywords":userQuery.keywords,"filters":userQuery.filters}]
    },
    query: "query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    __typename\n  }\n}\n"
  };

  const options = {
    headers: {
      authorization: `Bearer ${config.accessToken}`
    },
    cookies: {
      'cfc-access-token-cookie': config.accessToken,
    },
    json: true,
    rejectUnauthorized : false
  }

  const buildTable = (items: Array<object>)=>{
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(items, node)
    return node
  }

  needle('post', config.SEARCH_API, data, options)
   .then(res => {
     console.log('res', res)
     resolve(
      buildTable(res.body.data.searchResult[0].items)
    )
   })
   .catch(err => reject(new Error(err)))

});

const injectOurCSS = () => {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-search/package.json'))
    injectCSS(
        {
          key: "carbon",
          path: join(ourRoot, 'src/src-web/styles/index.css')
        }
      )
}

/**
 * Usage model for search
 *
 */
const usage = {
  command: 'search',
  strict: 'search',
  title: 'Search for kubernetes resources',
  header: 'Search for kubernetes resources',
  example: 'search',
  optional: [
    { name: 'searchInput', positional: true }
  ]
}

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  const opts = { usage, noAuthOk: true }
  commandTree.listen(`/s`, doSearch, opts)
  commandTree.listen(`/search`, doSearch, opts)
}
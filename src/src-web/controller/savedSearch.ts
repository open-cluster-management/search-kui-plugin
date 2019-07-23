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
import renderReact  from '../util/renderReact';
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { dirname, join } from 'path'
import * as needle from 'needle'

var apolloClient = require('../../lib/client/apolloClient')
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
    const results = items.map(item => {
      var rObj = {...item}
      rObj['kind'] = 'savedSearches'
      return rObj
    })
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(results, node)
    return node
  }

  needle('post', config.MCM_API, data, options)
   .then(res => {
     resolve(
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
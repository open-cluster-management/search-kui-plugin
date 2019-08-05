/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { CommandRegistrar } from '@kui-shell/core/models/command'
import renderReact from '../util/renderReact';
import { injectCSS } from '@kui-shell/core/webapp/util/inject'
import { dirname, join } from 'path'
import { convertStringToQuery } from '../util/search-helper'
import { toplevel as usage } from '../../usage'
import * as needle from 'needle'

var config = require('../../lib/shared/config')

const doSearch = (args) => new Promise((resolve, reject) => {
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

  const buildTable = (items: Array<object>)=>{
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(items, node)
    return node
  }

  needle('post', config.SEARCH_API, data, config.options)
   .then(res => {
     resolve(
      buildTable(res.body.data.searchResult[0].items)
    )
   })
   .catch(err => reject(new Error(err)))

});

export const injectOurCSS = () => {
    const ourRoot = dirname(require.resolve('@kui-shell/plugin-search/package.json'))
    injectCSS(
        {
          key: "carbon",
          path: join(ourRoot, 'src/src-web/styles/index.css')
        }
      )
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
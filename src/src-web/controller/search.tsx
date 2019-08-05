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
import { convertStringToQuery } from '../util/search-helper'
import { toplevel as usage } from '../../usage'
import * as needle from 'needle'
import { SEARCH_QUERY } from '../definitions/search-queries'

var config = require('../../lib/shared/config')

const doSearch = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length == 1){
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search <keyword>\nEXAMPLE: search aggregator')
  }

  const buildTable = (items: Array<object>)=>{
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    renderReact(items, node)
    return node
  }

  needle('post', config.SEARCH_API, SEARCH_QUERY(userQuery.keywords, userQuery.filters), config.options)
   .then(res => {
     resolve(
      buildTable(res.body.data.searchResult[0].items)
    )
   })
   .catch(err => reject(new Error(err)))

});

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: CommandRegistrar) => {
  const opts = { usage, noAuthOk: true }
  commandTree.listen(`/s`, doSearch, opts)
  commandTree.listen(`/search`, doSearch, opts)
}
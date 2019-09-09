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
import { toplevel as usage } from './helpfiles/searchhelp'
import { SEARCH_QUERY } from '../definitions/search-queries'
import { getSidecar } from './sidecar';
import strings from '../../src-web/util/i18n'

const doSearch = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)
  const str = `${strings('validation.error')}:\t${strings('validation.missing.parameters')}.\n\n${strings('validation.usage')}:\tsearch <${strings('validation.definition.value')}>\n\tsearch <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>\n\tsearch summary <${strings('validation.definition.kind')}> <${strings('validation.definition.resource')}>`

  if (args.argv.length === 1) {
    resolve(str)
  }

  const renderNoResults = () => {
    const node = document.createElement('pre')
    node.setAttribute('class', 'oops')
    node.innerText = 'No resources found.'
    return node
  }

  const buildTable = (items: object[]) => {
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    items.length > 1
      ? renderReact(items, node, args.command)
      : node.appendChild(renderNoResults())
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
  await commandTree.listen('/search/related:resources', getSidecar, opts)
}

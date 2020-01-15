/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Registrar } from '@kui-shell/core'
import HTTPClient from './HTTPClient'
import renderReact from '../util/renderReact';
import { convertStringToQuery } from '../util/search-helper'
import { toplevel as usage } from './helpfiles/searchhelp'
import { SEARCH_RELATED_QUERY } from '../definitions/search-queries'
import { getSidecar } from './sidecar';
import strings from '../../src-web/util/i18n'
import { getPluginState, setPluginState } from '../../pluginState'

export const renderSearchAvailable = (available, err?) => {
  const node = document.createElement('div')
  node.classList.add('is-search-available')

  const status = () => {
    const str = strings('search.service.not.installed.detail').split('{0}') // Split the string to only link the product name
    if (available) {
      return(
        <div>
          {!err
            ? <p>{strings('search.service.installed')}</p>
            : <p><span className='oops'>{strings('search.service.installed.error')}</span></p>
          }
        </div>
      )
    }
    else {
      return(
        <div>
          {!err
            ? <p>{strings('search.service.not.installed').concat(str[0])}
                <span className={'install-details-link'} onClick={ () => window.open('https://www.ibm.com/support/knowledgecenter/en/SSFC4F_1.1.0/kc_welcome_cloud_pak.html')}>
                  {strings('product.name')}
                </span>
                {str[1]}
              </p>
            : <p><span className='oops'>{strings('search.service.unavailable.error')}</span></p>
          }
        </div>
      )
    }
  }

  ReactDOM.render(React.createElement(status), node)
  return node
}

export const isSearchAvailable = () => {
  return getPluginState().enabled
}

const doSearch = (args) => new Promise((resolve, reject) => {
  const userQuery = convertStringToQuery(args.command)
  const str = `${strings('validation.error')}:\t${strings('validation.missing.parameters')}.\n\n${strings('validation.usage')}:\tsearch <${strings('validation.definition.value')}>\n\tsearch <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>\n\tsearch summary <${strings('validation.definition.kind')}> <${strings('validation.definition.resource')}>`

  if (args.argv.length === 1) {
    resolve(str)
  }

  const renderNoResults = () => {
    const node = document.createElement('pre')
    node.setAttribute('class', 'oops')
    node.innerText = strings('search.no.resources.found')
    return node
  }

  const buildTable = (data: any) => {
    const node = document.createElement('div', {is: 'react-entry-point'})
    node.classList.add('search-kui-plugin')
    data.items.length > 0
      ? renderReact(data, node, args.command)
      : node.appendChild(renderNoResults())
    return node
  }

  args.command !== 'search -i' && args.command !== 's -i' && isSearchAvailable()
  ? HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      resolve(
        buildTable(res.data.searchResult[0]),
      )
    })
    .catch((err) => {
      setPluginState('error', err)
      resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
    })
  : resolve(renderSearchAvailable(isSearchAvailable()))
});

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: Registrar) => {
  const opts = { usage, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/s`, doSearch, opts)
  commandTree.listen(`/search`, doSearch, opts)
  await commandTree.listen('/search/summary', getSidecar, opts)
  await commandTree.listen('/search/related:resources', getSidecar, opts)
}

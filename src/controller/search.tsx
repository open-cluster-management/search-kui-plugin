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

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Registrar, NavResponse } from '@kui-shell/core'
import HTTPClient from './HTTPClient'
import renderReact from '../util/renderReact';
import { convertStringToQuery } from '../util/search-helper'
import { usage } from './helpfiles/searchhelp'
import { SEARCH_RELATED_QUERY } from '../definitions/search-queries'
import { getSidecar } from './sidecar'
import strings from '../util/i18n'
import { getPluginState, setPluginState } from '../pluginState'
import Modal from '../components/Modal'
import { searchDelete } from './actionHandler'

export const renderSearchAvailable = (available, err?) => {
  const node = document.createElement('div')
  node.classList.add('is-search-available')
  const status = () => {
    if (available) {
          return(
        <div>
          {!err
            ? <p>{strings('search.service.installed')}</p>
            : <p><span className='oops'>{strings('search.service.installed.error')}</span></p>
          }
        </div>
      )
    } else {
      return(
        <div>
          {!err
            ? <p>{strings('search.service.not.installed')}</p>
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

export const doSearch = (args): any | NavResponse => {
  const userQuery = convertStringToQuery(args.command)

  if (args.argv.length === 1 || args.command === 'search -h') {
    return usage()
  } else {
    return new Promise((resolve, reject) => {
      if (args.command.includes('--save') && args.argv.indexOf('--save') === args.argv.length - 1) {
        const node = document.createElement('div')
    
        const save = () => {
          return (
            <Modal
              item={args}
              modalOpen={true}
              onClose={false}
              action={'save'}
            />
          )
        }
    
        ReactDOM.render(React.createElement(save), node)
        resolve(node)
      }

      if (args.command.includes('search -delete')) {
        resolve(searchDelete(args))
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
      : resolve(
        renderSearchAvailable(isSearchAvailable())
      )
    })
  }
}

/**
 * Here we register as a listener for commands
 *
 */
export default async (commandTree: Registrar) => {
  const searchCmd = commandTree.listen('/search', doSearch)
  commandTree.synonym('/s', doSearch, searchCmd)

  const summaryCmd = await commandTree.listen('/search/summary', getSidecar)
  commandTree.synonym('/s/summary', getSidecar, summaryCmd)

  const relatedCmd = await commandTree.listen('/search/related:resources', getSidecar)
  commandTree.synonym('/s/related:resources', getSidecar, relatedCmd)
}

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
import { getPluginState, setPluginState, resourceNotFound } from '../pluginState'
import Modal from '../components/Modal'
import { searchDelete } from './actionHandler'

export const renderSearchAvailable = () => {
  const node = document.createElement('div')
  node.classList.add('is-search-available')
  const status = () => {
    return(
      <div>
        <p><span className='oops'>{strings('search.service.installed.error')}</span></p>
      </div>
    )
  }

  ReactDOM.render(React.createElement(status), node)
  return node
}

export const doSearch = (args): any | NavResponse => {
  const { argv, command } = args
  const flags = getPluginState().flags

  if (argv.length === 1 || flags.includes(argv[1])) { // Help menu for search command
    return usage(argv)
  }

  return new Promise((resolve) => {
    if (command.includes('--related')) { // Get sidecar for related resources.
      resolve(getSidecar(args))
    }

    const userQuery = convertStringToQuery(command)

    if (command.includes('--save') && argv.indexOf('--save') === argv.length - 1) {
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

    if (command.includes('search -delete')) {
      resolve(searchDelete(args))
    }

    const buildTable = (data: any) => {
      const node = document.createElement('div', {is: 'react-entry-point'})
      node.classList.add('search-kui-plugin')
      data.items.length > 0
        ? renderReact(data, node, command)
        : node.appendChild(resourceNotFound())
      return node
    }

    HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters))
    .then((res) => {
      resolve(
        buildTable(res.data.searchResult[0]),
      )
    })
    .catch((err) => {
      setPluginState('error', err)
      resolve(renderSearchAvailable())
    })
  })
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
}

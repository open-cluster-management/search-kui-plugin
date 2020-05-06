/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent) {
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ToastNotification } from 'carbon-components-react'
import { Registrar } from '@kui-shell/core'
import HTTPClient from './HTTPClient'
import strings from '../util/i18n'
import { DELETE_RESOURCE, DELETE_QUERY, SAVED_SEARCH_QUERY } from '../definitions/search-queries'
import { setPluginState, getPluginState } from '../../pluginState'
import { renderSearchAvailable, isSearchAvailable } from './search'
import * as usage from './helpfiles/deletehelp'

export const notify = (content) => {
  const node = document.createElement('div')
  node.classList.add('bx--toast-notification-content')

  const toast = () => {
    return(
      <div className={'notification'}>
        <ToastNotification
          kind={!content.warning ? !content.message ? 'success' : 'error' : 'warning'}
          title={!content.warning ? !content.message ? content : content.message : content.warning}
          caption={new Date().toLocaleTimeString()}
          timeout={5000}
        />
      </div>
    )
  }
  ReactDOM.render(React.createElement(toast), node)

  return node
}

export const deleteSavedSearch = (args) => new Promise((resolve, reject) => {
  if (args.argv.length === 1) {
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: deleteSavedSearch <saved-search-name>')
  }

  const name = args.command.replace('deleteSavedSearch ', '')
  let warningToDelete = true

  // Check if the record exist before trying to delete.
  HTTPClient('post', 'search', SAVED_SEARCH_QUERY)
  .then((res) => {
    res.data.items.forEach((record) => {
      if (record.name === name) {
        warningToDelete = false // Record is available
      }
    })

    if (warningToDelete) { // Record is not available
      res['warning'] = strings('modal.save.warning', [name])
      resolve(notify(res))
    } else {
      HTTPClient('post', 'search', DELETE_QUERY(name))
      .then((resp) => {
        if (resp.data.deleteSearch) {
          resolve(notify(strings('modal.deleted.save.success', [name])))
        } else {
          resolve(notify(resp.errors[0]))
        }
      })
      .catch((err) => {
        setPluginState('error', err)
        resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
      })
    }
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
  })
})

export const deleteResource = (args) => new Promise((resolve, reject) => {
  if (args.argv.length !== 6) {
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: deleteResource <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>')
  }

  // delete resource args = (name, namespace, kind, cluster, selfLink)
  HTTPClient('post', 'console', DELETE_RESOURCE(args.argv[1], args.argv[2], args.argv[3], args.argv[4], args.argv[5]))
  .then((res) => {
    resolve(
      res.errors
        ? notify(res.errors[0])
        : notify(strings('modal.deleted.resource', [args.argv[1]]))
    )
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable(isSearchAvailable(), getPluginState().error))
  })
})

/**
 * Here we register as a listener for commands
 */
export default async (commandTree: Registrar) => {
  const deleteSavedSearchOpts = { usage: usage.deleteSavedSearch, noAuthOk: true, inBrowserOk: true }
  const deleteResourceOpts = { usage: usage.deleteResource, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/deleteSavedSearch`, deleteSavedSearch, deleteSavedSearchOpts)
  commandTree.listen(`/deleteResource`, deleteResource, deleteResourceOpts)
}

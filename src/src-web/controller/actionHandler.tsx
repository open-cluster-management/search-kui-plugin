/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent){
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

function deleteSavedSearch(args) {
  if (args.argv.length === 1) {
    return 'ERROR: Received wrong number of parameters.\nUSAGE: deleteSavedSearch <saved-search-name>'
  }

  const name = args.command.replace('deleteSavedSearch ', '')
  return new Promise((resolve, reject) => {
    let warningToDelete = true

    // Check if the record exist before trying to delete.
    HTTPClient('post', 'mcm', SAVED_SEARCH_QUERY)
    .then((res) => {
      res['warning'] = strings('modal.save.warning', [name])
      res.data.items.forEach(record => {
        if(record.name === name)
          warningToDelete = false // Record is available
      })

      warningToDelete
      ? resolve(notify(res))
      : null

      HTTPClient('post', 'mcm', DELETE_QUERY(name))
      .then((res) => {
        resolve(
          res.data.deleteQuery.userQueries
          ? notify(strings('modal.deleted.save.success', [name]))
          : notify(res.errors[0])
        )
      })
    })
  })
}

function deleteResource(args) {
  if (args.argv.length !== 6) {
    return 'ERROR: Received wrong number of parameters.\nUSAGE: deleteResource <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>'
  }
  return new Promise((resolve, reject) => {
    // delete resource args = (name, namespace, kind, cluster, selfLink)
    HTTPClient('post', 'mcm', DELETE_RESOURCE(args.argv[1], args.argv[2], args.argv[3], args.argv[4], args.argv[5]))
    .then((res) => {
      resolve(
        res.errors
          ? notify(res.errors[0])
          : notify(strings('modal.deleted.resource', [args.argv[1]]))
      )
    })
  })
}

const deleteSavedSearchUsage = {
  command: 'deleteSavedSearch',
  strict: 'deleteSavedSearch',
  title: 'Deletes a previously saved search',
  header: 'Deletes a previously saved search',
  example: 'deleteSavedSearch <saved-search-name>',
  optional: [
    { name: 'name', positional: true },
  ],
}

const deleteResourceUsage = {
  command: 'deleteResource',
  strict: 'deleteResource',
  title: 'Deletes a cluster resource',
  header: 'Deletes a cluster resource',
  example: 'deleteResource <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>',
}

/**
 * Here we register as a listener for commands
 */
export default async (commandTree: Registrar) => {
  const deleteSavedSearchOpts = { deleteSavedSearchUsage, noAuthOk: true, inBrowserOk: true }
  const deleteResourceOpts = { deleteResourceUsage, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/deleteSavedSearch`, deleteSavedSearch, deleteSavedSearchOpts)
  commandTree.listen(`/deleteResource`, deleteResource, deleteResourceOpts)
}

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
import { ToastNotification } from 'carbon-components-react'
import { CommandRegistrar } from '@kui-shell/core/models/command'
import HTTPClient from './HTTPClient'
import { DELETE_RESOURCE, DELETE_QUERY } from '../definitions/search-queries'

export const notify = (content) => {
  const node = document.createElement('div')
  node.classList.add('bx--toast-notification-content')

  const toast = () => {
    return(
      <div className={'notification'}>
        <ToastNotification
          kind={!content.message ? 'success' : 'error'}
          title={!content.message ? content : content.message}
          caption={new Date().toLocaleTimeString()}
          timeout={4000}
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
  const name = args.argv[1]
  return new Promise((resolve, reject) => {
    HTTPClient('post', 'mcm', DELETE_QUERY(name))
    .then((res) => {
      resolve(
        res.errors
          ? notify(res.errors[0])
          : notify(`Successfully deleted ${name}`),
      )
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
          : notify(`Successfully deleted ${args.argv[1]}`),
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
  // optional: [
  //   { name: 'name', positional: true }
  // ]
}

/**
 * Here we register as a listener for commands
 */
export default async (commandTree: CommandRegistrar) => {
  const deleteSavedSearchOpts = { deleteSavedSearchUsage, noAuthOk: true, inBrowserOk: true }
  const deleteResourceOpts = { deleteResourceUsage, noAuthOk: true, inBrowserOk: true }
  commandTree.listen(`/deleteSavedSearch`, deleteSavedSearch, deleteSavedSearchOpts)
  commandTree.listen(`/deleteResource`, deleteResource, deleteResourceOpts)
}

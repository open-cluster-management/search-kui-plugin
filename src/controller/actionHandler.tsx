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

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent) {
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

const deletedResources = []

import HTTPClient from './HTTPClient'
import * as lodash from 'lodash'
import strings from '../util/i18n'
import { DELETE_RESOURCE, DELETE_QUERY, SAVED_SEARCH_QUERY } from '../definitions/search-queries'
import { setPluginState } from '../pluginState'
import { renderSearchAvailable } from './search'

export const deleteSavedSearch = (args) => new Promise((resolve) => {
  if (args.argv.length === 1) {
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search -delete="save" <saved-search-name>')
  }

  const name = args.command.replace('search -delete="save" ', '')
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
      resolve(res['warning'])
    } else {
      HTTPClient('post', 'search', DELETE_QUERY(name))
      .then((resp) => {
        if (resp.data.deleteSearch) {
          resolve(strings('modal.deleted.save.success', [name]))
        } else {
          resolve(resp.errors[0])
        }
      })
      .catch((err) => {
        setPluginState('error', err)
        resolve(renderSearchAvailable())
      })
    }
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable())
  })
})

export const deleteResource = (args) => new Promise((resolve) => {
  if (args.argv.length !== 7) {
    resolve('ERROR: Received wrong number of parameters.\nUSAGE: search -delete="resource" <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>')
  }

  // delete resource args = (name, namespace, kind, cluster, selfLink)
  HTTPClient('post', 'console', DELETE_RESOURCE(args.argv[2], args.argv[3], args.argv[4], args.argv[5], args.argv[6]))
  .then((res) => {
    const data = lodash.get(res, 'data', '')
    if (data.deleteResource && !deletedResources.includes(args.argv[2])) {
      deletedResources.push(args.argv[2]) // Keep track of resources that have been deleted. KUI allows a resource to be deleted multiple times, which is not possible.
      resolve(
        res.errors
          ? res.errors[0]
          : strings('modal.deleted.resource', [args.argv[2]])
      )
    } else {
      resolve(strings('modal.delete.warning', [args.argv[2], args.argv[4]]))
    }
  })
  .catch((err) => {
    setPluginState('error', err)
    resolve(renderSearchAvailable())
  })
})

export const searchDelete = (args) => new Promise((resolve) => {
  switch(args.argv[1]) {
    case '-delete="save"':
      resolve(deleteSavedSearch(args))
      break
    case '-delete="resource"':
      resolve(deleteResource(args))
      break
    default:
      resolve(strings('delete.command.unknown.value'))
  }
})

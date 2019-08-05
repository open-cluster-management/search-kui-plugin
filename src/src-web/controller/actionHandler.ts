/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as needle from 'needle'
import { CommandRegistrar } from '@kui-shell/core/models/command'

var config = require('../../lib/shared/config')

function deleteSavedSearch(args) {
  if (args.argv.length == 1){
    return 'ERROR: Received wrong number of parameters.\nUSAGE: deleteSavedSearch <saved-search-name>'
  }
  const name = args.argv[1]
  return new Promise((resolve, reject) => {
    const data = {
      operationName: "deleteQuery",   
      query: "mutation deleteQuery($resource: JSON!) {\n deleteQuery(resource: $resource)\n}\n",
      variables: {
        resource: {
          name
        }
      }
    }

    needle('post', config.MCM_API, data, config.options)
    .then(res => {
      resolve(
        res.body.errors
          ? res.body.errors[0].message
          : `Successfully deleted ${name}`
      )
    })
    .catch(err => reject(new Error(err)))
  })
}

function deleteResource(args) {
  if (args.argv.length !== 6) {
    return 'ERROR: Received wrong number of parameters.\nUSAGE: deleteResource <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>'
  }
  return new Promise((resolve, reject) => {
    const data = {
      operationName: "deleteResource",
      query: "mutation deleteResource($selfLink: String, $name: String, $namespace: String, $cluster: String, $kind: String, $childResources: JSON) {\ndeleteResource(selfLink: $selfLink, name: $name, namespace: $namespace, cluster: $cluster, kind: $kind, childResources: $childResources)\n}\n",
      variables: {
        // TODO - Not sure if child resources are handled at all..
        // childResources: [],
        name: args.argv[1],
        namespace: args.argv[2],
        kind: args.argv[3],
        cluster: args.argv[4],
        selfLink: args.argv[5]
      }
    }

    needle('post', config.MCM_API, data, config.options)
    .then(res => {
      resolve(
          res.body.errors
            ? res.body.errors[0].message
            : `Successfully deleted ${name}`
      )
    })
    .catch(err => reject(new Error(err)))
  })
}

const deleteSavedSearchUsage = {
  command: 'deleteSavedSearch',
  strict: 'deleteSavedSearch',
  title: 'Deletes a previously saved search',
  header: 'Deletes a previously saved search',
  example: 'deleteSavedSearch <saved-search-name>',
  optional: [
    { name: 'name', positional: true }
  ]
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
  const deleteSavedSearchOpts = { deleteSavedSearchUsage, noAuthOk: true }
  const deleteResourceOpts = { deleteResourceUsage, noAuthOk: true }
  commandTree.listen(`/deleteSavedSearch`, deleteSavedSearch, deleteSavedSearchOpts)
  commandTree.listen(`/deleteResource`, deleteResource, deleteResourceOpts)
}

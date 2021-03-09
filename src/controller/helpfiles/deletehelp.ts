/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import strings from '../../util/i18n'

export const deleteSavedSearch = {
  breadcrumb: 'deleteSavedSearch',
  command: 'deleteSavedSearch',
  title: strings('delete.savedsearchhelp.title'),
  header: strings('delete.savedsearchhelp.header'),
  example: 'deleteSavedSearch <saved-search-name>',
  available: [{
    docs: strings('delete.savedsearchhelp.title'),
    dir: true,
    commandSuffix: '-h'
  }],
  related: ['search', 'savedsearches', 'deleteResource'],
}

export const deleteResource = {
  breadcrumb: 'deleteResource',
  command: 'deleteResource',
  title: strings('delete.resourcehelp.title'),
  header: strings('delete.resourcehelp.header'),
  example: 'deleteResource <resource-name> <resource-namespace> <resource-kind> <resource-cluster> <resource-selfLink>',
  available: [{
    docs: strings('delete.resourcehelp.title'),
    dir: true,
    commandSuffix: '-h'
  }],
  related: ['search', 'savedsearches', 'deleteSavedSearch'],
}

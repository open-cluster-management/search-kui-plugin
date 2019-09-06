/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

/** how many options to show at a time, i.e. before scrolling */
const nRowsInViewport = 1

/** list of related commands */
const all = [
  'search',
]
const allExcept = (cmd) => all.filter((_) => _ !== cmd)

/* the breadcrumb chain */
const parents = ['savedsearches']

const header = {
    search: 'Search across managed clouds for kubernetes resources',
    savedsearches: 'Show saved searches of Kubernetes resources across managed clouds',
}

/**
 * Usage model for the savedsearches plugin
 *
 */
export const toplevel = {
    breadcrumb: 'savedsearches',
    command: 'savedsearches',
    title: 'Show saved searches of Kubernetes resources across managed clouds',
    header: 'This command helps you retrieve saved searches.',
    example: 'savedsearches',
    nRowsInViewport: 1,
    available: [
      {
        command: 'savedsearches',
        docs: header.savedsearches,
        dir: true,
        commandPrefix: null,
      },
    ],
    related: ['search'],
  }

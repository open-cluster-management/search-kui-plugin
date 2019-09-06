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
  'savedsearches',
]
const allExcept = (cmd) => all.filter((_) => _ !== cmd)

/* the breadcrumb chain */
const parents = ['search']

const header = {
  search: 'Search across managed clouds for kubernetes resources',
  savedsearches: 'Show saved searches of Kubernetes resources across managed clouds',
}

/**
 * Usage model for the search plugin
 *
 */
export const toplevel = {
    breadcrumb: 'search',
    command: 'search',
    title: 'Search across managed clouds for kubernetes resources',
    header: 'Use the search command to search all of your managed clouds and retrieve a list of resources that meet a specified criteria. You select from common search criteria or enter your own string to search for.',
    example: 'search <value>\nsearch <field>:<value>\nsearch summary <kind> <resource>\n',
    nRowsInViewport: 4,
    available: [
      {
        docs: header.search,
        dir: true,
        commandPrefix: 'search -h',
      },
    ],
    related: ['savedsearches'],
  }

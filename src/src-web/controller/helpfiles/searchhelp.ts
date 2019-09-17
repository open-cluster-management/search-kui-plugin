/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-search')

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
  search: strings('searchhelp.title'),
  savedsearches: strings('savedsearchhelp.title')
}

/**
 * Usage model for the search plugin
 *
 */
export const toplevel = {
    breadcrumb: 'search',
    command: 'search',
    title: strings('searchhelp.title'),
    header: `${strings('searchhelp.header')}.`,
    example: `search <${strings('validation.definition.value')}>\nsearch <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>\nsearch ${strings('validation.definition.summary')} <${strings('validation.definition.kind')}> <${strings('validation.definition.resource')}>`,
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

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import strings from '../../util/i18n'

const sections = [{
  title:  strings('validation.definition.flag'),
  rows: [
    {
      name: '-i',
      docs: strings('searchhelp.search.install.docs'),
    },
    {
      name: '--save',
      docs: strings('searchhelp.search.save.docs'),
      noclick: true,
    },
  ],
}]

const detailedExample = [
  {
    command: `search <${strings('validation.definition.value')}>`,
    docs: strings('searchhelp.search.value.example'),
  },
  {
    command: `search <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>`,
    docs: strings('searchhelp.search.field.example'),
  },
  {
    command: `search <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}> --save`,
    docs: strings('searchhelp.search.save.example'),
  },
  {
    command: `search ${strings('validation.definition.summary')} <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>`,
    docs: strings('searchhelp.search.summary.example'),
  },
]

/**
 * Usage model for the search plugin
 *
 */
export const toplevel = {
  breadcrumb: 'search',
  command: 'search',
  title: strings('searchhelp.title'),
  header: strings('searchhelp.header'),
  detailedExample, // Example
  example: `search [${strings('validation.definition.flag')}][${strings('validation.definition.option')}]`, // Usage
  nRowsInViewport: 4,
  available: [
    {
      docs: strings('searchhelp.title'),
      dir: true,
      commandPrefix: 'search -h',
    },
  ],
  sections,
  alias: 's',
  related: ['savedsearches'],
}

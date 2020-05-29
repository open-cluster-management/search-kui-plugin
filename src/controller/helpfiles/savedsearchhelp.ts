/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import strings from '../../util/i18n'

/**
 * Usage model for the savedsearches plugin
 *
 */
export const toplevel = {
  breadcrumb: 'savedsearches',
  command: 'savedsearches',
  title: strings('savedsearchhelp.title'),
  header: strings('savedsearchhelp.header'),
  example: strings('savedsearchhelp.example'),
  nRowsInViewport: 1,
  available: [
    {
      command: 'savedsearches',
      docs: strings('savedsearchhelp.title'),
      dir: true,
      commandPrefix: null,
    },
  ],
  alias: 'ss',
  related: ['search', 'deleteResource', 'deleteSavedSearch'],
}

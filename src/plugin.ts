/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import { Registrar } from '@kui-shell/core'
import actions from './controller/actionHandler'
import savedSearch from './controller/savedSearch'
import search from './controller/search'

export default async (commandTree: Registrar) => {
  return Promise.all([
    actions(commandTree),
    search(commandTree),
    savedSearch(commandTree),
  ])
}

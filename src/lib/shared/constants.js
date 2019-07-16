/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

module.exports.MAX_CHART_DATA_SIZE = 30

// keep order from lowest to highest role
module.exports.ROLES = {
  VIEWER: 'Viewer',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
  ADMIN: 'Administrator',
  CLUSTER_ADMIN: 'ClusterAdministrator'
}

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

'use strict'

import * as lodash from 'lodash'
const moment = require('moment')

/*
* UI helpers to help with data transformations
* */

export const getAge = (item, timestampKey?) => {
  const key = timestampKey || 'created'
  const createdTime = lodash.get(item, key)

  return moment(createdTime, 'YYYY-MM-DDTHH:mm:ssZ').fromNow()
}

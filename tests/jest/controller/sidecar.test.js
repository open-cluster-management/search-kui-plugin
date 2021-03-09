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
'use strict'
import "regenerator-runtime"
const fn = require('../../../dist/controller/sidecar')
const related = require('../../data/related')

const data = related.data
const resource = related.yaml

describe('Building Sidecar', () => {
  it('should build a resource sidecar with tabs [Summary, YAML, Related Resources]', () => {
    expect(fn.buildSidecar('resource', data, resource)).toMatchSnapshot()
  })

  it('should build a query sidecar with tabs [Related Resources]', () => {
    expect(fn.buildSidecar('query', data)).toMatchSnapshot()
  })
})

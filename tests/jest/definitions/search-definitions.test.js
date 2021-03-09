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
const searchdefinitions = require('../../../dist/definitions/search-definitions')

describe('Search definitions', () => {
  const kinds = [
    'application',
    'applicationrelationship',
    'cluster',
    'configmap',
    'cronjob',
    'daemonset',
    'deployable',
    'deployment',
    'genericresource',
    'job',
    'namespace',
    'node',
    'persistentvolume',
    'persistentvolumeclaim',
    'placementbinding',
    'placementpolicy',
    'pod',
    'policy',
    'release',
    'replicaset',
    'savedSearches',
    'secret',
    'service',
    'statefulset'
  ]

  kinds.forEach(kind => {
    it(`should an return an object of columns and actions for ${kind} resources`, () => {
      expect(searchdefinitions.default[kind]).toBeDefined()
      if(kind === 'savedSearches'){
        expect(searchdefinitions.default[kind]).toMatchObject({
          columns: [
            { key: 'name' },
            { key: 'description' },
            { key: 'searchText' },
            { key: 'count' },
          ],
          actions: []
        })
      }
      expect(searchdefinitions.default[kind]).toMatchSnapshot()
    })
  })
})

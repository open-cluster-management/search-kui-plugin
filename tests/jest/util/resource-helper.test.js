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
const helper = require('../../../dist/util/resource-helper')

const namespace = 'open-cluster-management'
const cluster = 'local-cluster'
const timestamp = '2019-09-17T18:00:29Z'

const items = [
  {
    kind: "pod",
    name: "mock-name",
    namespace,
    cluster,
    created: timestamp,
  },
  {
    kind: "cronjob",
    name: "mock-name2",
    namespace,
    cluster,
    created: timestamp,
    schedule: "mock-schedule",
    suspend: "mock-suspend",
    active: "mock-active",
    lastSchedule: timestamp,
  },
  {
    kind: "release",
    name: "mock-name3",
    namespace,
    cluster,
    created: timestamp,
    status: "DEPLOYED",
    chartName: "mock-chart-name",
    chartVersion: "0.0.0",
    updated: timestamp,
  }
]

describe('Resource helper getAge', () => {
  const spy = jest.spyOn(helper, 'getAge')

  items.forEach(item => {
    helper.getAge(item)
    it(`should get the age of ${item.name} from the moment it was created (${item.created})`, () => {
      expect(spy).toBeCalled()
      expect(helper.getAge(item)).toMatchSnapshot()
    })
  })

  helper.getAge(items[1], 'lastSchedule')
  it(`should get the age of ${items[1].name} from the moment it was last scheduled (${items[1].lastSchedule})`, () => {
    expect(spy).toBeCalled()
    expect(helper.getAge(items[1], 'lastSchedule')).toMatchSnapshot()
  })

  helper.getAge(items[2], 'updated')
  it(`should get the age of ${items[2].name} from the moment it was updated (${items[2].updated})`, () => {
    expect(spy).toBeCalled()
    expect(helper.getAge(items[2], 'updated')).toMatchSnapshot()
  })
})

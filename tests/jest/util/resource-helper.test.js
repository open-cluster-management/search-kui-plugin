/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
'use strict'
const helper = require('../../../dist/src-web/util/resource-helper')

const items = [
  {
    kind: "pod",
    name: "mock-name",
    namespace: "kube-system",
    cluster: "local-cluster",
    created: "2019-09-17T18:13:28Z",
  },
  {
    kind: "cronjob",
    name: "mock-name2",
    namespace: "kube-system",
    cluster: "local-cluster",
    created: "2019-09-17T18:00:29Z",
    schedule: "mock-schedule",
    suspend: "mock-suspend",
    active: "mock-active",
    lastSchedule: "2019-09-17T18:00:29Z",
  },
  {
    kind: "release",
    name: "mock-name3",
    namespace: "kube-system",
    cluster: "local-cluster",
    created: "2019-09-17T18:00:29Z",
    status: "DEPLOYED",
    chartName: "mock-chart-name",
    chartVersion: "0.0.0",
    updated: "2019-09-17T18:00:29Z",
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

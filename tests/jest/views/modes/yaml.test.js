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
const yaml = require('../../../../dist/views/modes/yaml')

const items = [
  {kind: require('../../../data/deployment')},
]
const deployment = items[0].kind.deployment
const data = items[0].kind.data


// Resource's YAML tab
describe('YAML mode', () => {
  const spy = jest.spyOn(yaml, 'yamlTab')
  const _ = yaml.yamlTab(deployment, data)

  it('should display an editor object with a detailed yaml', () => {
    expect(spy).toBeCalled()
    expect(yaml.yamlTab(deployment, data)).toMatchSnapshot()
  })
})

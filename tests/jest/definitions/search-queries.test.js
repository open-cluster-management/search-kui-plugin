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
const searchqueries = require('../../../dist/definitions/search-queries')
const res = require('../../data/pod')
const yaml = require('../../data/deployment')
const savedsearches = require('../../data/savedsearches')

const keys = ['operationName', 'query', 'variables']

const input = {
  filters: [
    {
      property: 'kind',
      value: 'pod'
    }
  ],
  keywords: []
}

// Each query should be defined and return an object with the same keys.
describe('Search Queries', () => {
  it('should DELETE_QUERY', () => {
    expect(searchqueries.DELETE_QUERY(res.pod.name)).toBeDefined()
    expect(Object.keys(searchqueries.DELETE_QUERY(res.pod.name))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.DELETE_QUERY(res.pod.name)).toMatchSnapshot()
  })

  it('should DELETE_RESOURCE', () => {
    expect(searchqueries.DELETE_RESOURCE(res.pod.name, res.pod.namespace, res.pod.kind, res.pod.cluster, res.pod.apiVersion)).toBeDefined()
    expect(Object.keys(searchqueries.DELETE_RESOURCE(res.pod.name, res.pod.namespace, res.pod.kind, res.pod.cluster, res.pod.apiVersion))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.DELETE_RESOURCE(res.pod.name, res.pod.namespace, res.pod.kind, res.pod.cluster, res.pod.apiVersion)).toMatchSnapshot()
  })

  it('should GET_SEARCH_COMPLETE', () => {
    expect(searchqueries.GET_SEARCH_COMPLETE('pod', input)).toBeDefined()
    expect(Object.keys(searchqueries.GET_SEARCH_COMPLETE('pod', input))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.GET_SEARCH_COMPLETE('pod', input)).toMatchSnapshot()
  })

  it('should GET_SEARCH_SCHEMA', () => {
    expect(searchqueries.GET_SEARCH_SCHEMA).toBeDefined()
    expect(Object.keys(searchqueries.GET_SEARCH_SCHEMA)).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.GET_SEARCH_SCHEMA).toMatchSnapshot()
  })

  it('should SAVED_SEARCH_QUERY', () => {
    expect(searchqueries.SAVED_SEARCH_QUERY).toBeDefined()
    expect(Object.keys(searchqueries.SAVED_SEARCH_QUERY)).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.SAVED_SEARCH_QUERY).toMatchSnapshot()
  })

  it('should RESOURCE_LOGS', () => {
    expect(searchqueries.RESOURCE_LOGS(res.pod)).toBeDefined()
    expect(Object.keys(searchqueries.RESOURCE_LOGS(res.pod))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.RESOURCE_LOGS(res.pod)).toMatchSnapshot()
  })

  it('should SEARCH_ACM_QUERY', () => {
    expect(searchqueries.SEARCH_ACM_QUERY(res.pod)).toBeDefined()
    expect(Object.keys(searchqueries.SEARCH_ACM_QUERY(res.pod))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.SEARCH_ACM_QUERY(res.pod)).toMatchSnapshot()
  })

  it('should SEARCH_QUERY', () => {
    expect(searchqueries.SEARCH_QUERY(input.keywords, input.filters)).toBeDefined()
    expect(Object.keys(searchqueries.SEARCH_QUERY(input.keywords, input.filters))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.SEARCH_QUERY(input.keywords, input.filters)).toMatchSnapshot()
  })

  it('should SEARCH_QUERY_COUNT', () => {
    expect(searchqueries.SEARCH_QUERY_COUNT(input)).toBeDefined()
    expect(Object.keys(searchqueries.SEARCH_QUERY_COUNT(input))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.SEARCH_QUERY_COUNT(input)).toMatchSnapshot()
  })

  it('should SEARCH_RELATED_QUERY', () => {
    expect(searchqueries.SEARCH_RELATED_QUERY(input.keywords, input.filters)).toBeDefined()
    expect(Object.keys(searchqueries.SEARCH_RELATED_QUERY(input.keywords, input.filters))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.SEARCH_RELATED_QUERY(input.keywords, input.filters)).toMatchSnapshot()
  })

  it('should UPDATE_RESOURCE', () => {
    expect(searchqueries.UPDATE_RESOURCE(yaml.deployment)).toBeDefined()
    expect(Object.keys(searchqueries.UPDATE_RESOURCE(yaml.deployment))).toEqual(expect.arrayContaining(keys))
    expect(searchqueries.UPDATE_RESOURCE(yaml.deployment)).toMatchSnapshot()
  })

  savedsearches.data.forEach(search => {
    it(`should SAVE_SEARCH query - ${search.name}`, () => {
      expect(searchqueries.SAVE_SEARCH(search)).toBeDefined()
      expect(Object.keys(searchqueries.SAVE_SEARCH(search))).toEqual(expect.arrayContaining(keys))
      expect(searchqueries.SAVE_SEARCH(search)).toMatchSnapshot()
    })
  });
})

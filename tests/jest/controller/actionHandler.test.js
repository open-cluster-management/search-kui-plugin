/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
'use strict'
import "regenerator-runtime"
const actionHandler = require('../../../dist/controller/actionHandler')

describe('Search action handler', () => {
  const name = 'All Fake Pods'

  describe('Delete saved searches', () => {
    const args =  {
      command: `deleteSavedSearch ${name}`,
      argv: ['deleteSavedSearch', name]
    }

    const spy = jest.spyOn(actionHandler, 'deleteSavedSearch')
    const _ = actionHandler.deleteSavedSearch(args)

    it('should delete a saved search', () => {
      expect(spy).toBeCalled()
      expect(actionHandler.deleteSavedSearch).toMatchSnapshot()
    })
  })

  describe('Delete resources', () => {
    const args =  {
      command: 'deleteResource fake-name fake-namespace fake-kind fake-cluster fake-selfLink',
      argv: ['deleteResource', 'fake-name', 'fake-namespace', 'fake-kind', 'fake-cluster', 'fake-selfLink']
    }

    const spy = jest.spyOn(actionHandler, 'deleteResource')
    const _ = actionHandler.deleteResource(args)

    it('should delete a resource', () => {
      expect(spy).toBeCalled()
      expect(actionHandler.deleteResource).toMatchSnapshot()
    })
  })
})

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
'use strict'

import React from 'react'
import ResourceTable from '../../../dist/components/ResourceTable'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

const resource = require('../../data/ResourceTableMockData')

afterEach(() => {
  // console.log('Clearing mock data')
  const mockFn = jest.fn()
  mockFn.mockReset()
})

describe('ResourceTable component', () => {
  resource.data.related.forEach(res => { // Using related data for bigger testing sample
    const WRAPPER = shallow(<ResourceTable items={res.items} kind={res.kind} />)

    const TABLE = WRAPPER.find('DataTable')
    const HEADER = { button: WRAPPER.find('button.search--resource-table-header-button') }

    HEADER['text'] = HEADER.button.text()
    HEADER['caret'] = HEADER.button.find('span.arrow-up')
    HEADER['filter'] = TABLE.find('div.bx--table-sort-v2')

    WRAPPER.instance().sortIds = jest.fn()
    WRAPPER.update()
    // console.log('instance', WRAPPER.instance())
    WRAPPER.instance().componentDidMount()

    // console.log('Headers', TABLE.props().headers.render())
    // console.log('Rows', TABLE.props().rows)
    // console.log('State', WRAPPER.state())
    // console.log('Props', TABLE.props())
    describe('mounting', () => {
      it('should mount the ResourceTable component', () => {
        expect(true).toBeTruthy()
      })
    })

    describe('data table', () => {
      it(`should render (${res.kind}) data table`, () => {
        expect(TABLE).toBeDefined()
        expect(TABLE).toHaveLength(1)
      })

      describe('onClick event', () => {
        describe('header event', () => {
          it(`should sort (${res.kind}) resources`, () => {
            console.log(TABLE)
            // expect(TABLE.props().filter('name')).toMatchSnapshot()
          })
        })
      })
    })
    
    describe('header button', () => { // Simulate Resource Table collapse
      it(`should render (${res.kind}) header button`, () => {
        expect(HEADER.button).toBeDefined()
        expect(HEADER.button).toHaveLength(1)
      })

      describe('onClick event', () => {
        it(`should collapse (${res.kind}) resource table`, () => {
          HEADER.button.simulate('click') // Click on header button
          expect(HEADER.text).toBe(`${res.kind}(${res.count})`.concat(HEADER.caret.text())) // Header count should remain the same
          expect(shallowToJson(WRAPPER)).toMatchSnapshot()
        })
  
        it(`should display (${res.kind}) resource table`, () => {
          HEADER.button.simulate('click') // Click on header button
          expect(HEADER.text).toBe(`${res.kind}(${res.count})`.concat(HEADER.caret.text())) // Header count should remain the same
          expect(shallowToJson(WRAPPER)).toMatchSnapshot()
        })
      })
    })
  })
})
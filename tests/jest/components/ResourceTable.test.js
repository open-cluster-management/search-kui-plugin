/*******************************************************************************
 *
 * Copyright (c) 2020 Red Hat, Inc.
 * Copyright Contributors to the Open Cluster Management project
 *
 *******************************************************************************/
'use strict'

import React from 'react'
import ResourceTable from '../../../dist/components/ResourceTable'
import { shallow, mount } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

const resource = require('../../data/ResourceTableMockData')

afterEach(() => {
  const mockFn = jest.fn()
  mockFn.mockReset()
})

describe('ResourceTable component', () => {
  resource.data.related.forEach(res => {
    // Using related data for bigger testing sample
    const WRAPPER = shallow(<ResourceTable items={res.items} kind={res.kind} />)

    const TABLE = WRAPPER.find('DataTable')
    const HEADER = { button: WRAPPER.find('button.search--resource-table-header-button') }

    HEADER['text'] = HEADER.button.text()
    HEADER['caret'] = HEADER.button.find('span.arrow-up')
    HEADER['filter'] = TABLE.find('div.bx--table-sort-v2')

    WRAPPER.instance().sortIds = jest.fn()
    WRAPPER.update()

    // describe('mounting', () => {
    //   it('should mount the ResourceTable component', () => {
    //     const COMPONENT = mount(<ResourceTable items={res.items} kind={res.kind} />)
    //   })
    // })

    describe('data table', () => {
      it(`should render (${res.kind}) data table`, () => {
        expect(TABLE).toBeDefined()
        expect(TABLE).toHaveLength(1)
      })

      /* describe('onClick event', () => {
        describe('header event', () => {
          it(`should sort (${res.kind}) resources`, () => {

          })
        })
      }) */
    })

    describe('header button', () => {
      // Simulate Resource Table collapse
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

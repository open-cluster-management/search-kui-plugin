/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
'use strict'

const CSS = require('../../../dist/util/injectOurCSS')
const env = 'test'

describe('Injecting our CSS', () => {
  const spy = jest.spyOn(CSS, 'injectOurCSS')
  let _ = CSS.injectOurCSS(env)

  it(`should import and inject our css for environment (${env})`, () => {
    expect(CSS.injectOurCSS(env)).toBeDefined()
    expect(spy).toBeCalled()
    expect(CSS.injectOurCSS(env)).toMatchSnapshot()
  })

  _ = CSS.injectOurCSS('dev')

  it(`should import and inject our css for environment (dev)`, () => { // Will return undefined, due to issues accessing '@kui-shell/plugin-search/mdist/src-web/styles/index.css'
    expect(spy).toBeCalled()
    expect(CSS.injectOurCSS('dev')).toMatchSnapshot()
  })
})
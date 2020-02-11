/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent) {
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

import * as React from 'react'
import * as PropTypes from 'prop-types'

import { Dropdown, Loading } from 'carbon-components-react'
import { LoggerProps, LoggerState } from '../model/Logger'

import * as lodash from 'lodash'
import HTTPClient from '../controller/HTTPClient';
import { RESOURCE_LOGS } from '../definitions/search-queries';

import strings from '../../src-web/util/i18n'

export default class Logger extends React.PureComponent<LoggerProps, LoggerState> {
  static propTypes = {
    data: PropTypes.any,
    items: PropTypes.any,
  }

  refresh: any
  container: any

  constructor(props) {
    super(props)
    this.state = {
      selectedItem: lodash.get(this.props.items, '[0]', ''),
      logs: '',
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.getLogs = this.getLogs.bind(this)
    this.isFocused = this.isFocused.bind(this)
  }

  componentDidMount = () => {
    this.container = this.state.selectedItem
    this.getLogs()
    this.refresh = setInterval(() => this.isFocused(this.getLogs), 15000)
  }

  componentWillUnmount = () => {
    clearInterval(this.refresh)
  }

  handleOnChange(event) {
    this.container = event.selectedItem
    this.setState({logs: ''})
    this.getLogs()
    clearInterval(this.refresh)
    this.refresh = setInterval(() => this.isFocused(this.getLogs), 15000)
  }

  isFocused = (fn) => {
    // This will allow KUI to check if the sidecar tabs are being focused on. Based upon the tabindex, this will determine if the log tab will be refreshed.
    const focus = document.getElementsByClassName('kui--tab-navigatable kui--notab-when-sidecar-hidden bx--tabs__nav-link')
    document.querySelector('.logs-container__content') && focus[0]['tabIndex'] >= 0
    ? fn()
    : document.querySelector('.visible.sidecar-is-minimized') && document.querySelector('.logs-container__content')
      ? null
      : this.componentWillUnmount()
  }

  getLogs() {
    if (!document.hidden) {
      const node = document.createElement('div')
      node.classList.add('scrollable')
      node.classList.add('bx--structured-list--summary')

      const record = {
        cluster: this.props.data.cluster,
        container: this.container,
        name: this.props.data.name,
        namespace: this.props.data.namespace,
      }

      HTTPClient('post', 'mcm', RESOURCE_LOGS(record))
      .then((res) => {
        this.setState({
          selectedItem: this.container,
          logs: lodash.get(res, 'data.logs', '') !== null ? res.data.logs : strings('search.notfound'),
        })
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dropdown
          id='resource-container-dropdown'
          label={lodash.get(this.props.items, '[0]', '')}
          items={this.props.items}
          onChange={this.handleOnChange}
        />

        { !this.state.logs
          ? <div className='loading-container'><Loading withOverlay={false} className='resource-load'/></div>
          : <div className='logs-container__content'>
            <pre>
              {this.state.logs}
            </pre>
          </div>
        }
      </React.Fragment>
    )
  }
}

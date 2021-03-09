/*******************************************************************************
* 
* Copyright (c) 2020 Red Hat, Inc.
* 
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

import * as React from 'react'
import SearchBar from './SearchBar'
import { SearchInputProps, SearchInputState } from '../model/SearchInput'
import strings from '../util/i18n'
import { getPluginState } from '../pluginState'

export default class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
  static propTypes = { }
  constructor(props) {
    super(props)
    this.state = {
      searchSchema: [{id: 'loading', name: strings('search.loading'), disabled: true}],
    }
  }

  componentDidMount() {
    if (getPluginState().searchSchema.length > 0) {
      this.setState({ searchSchema: getPluginState().searchSchema })
    } else {
      this.setState({ searchSchema: getPluginState().default })
    }
  }

  render() {
    return (
      <SearchBar
        onKeyPress={this.props.onKeyPress}
        value={this.props.value}
        onChange={this.props.onChange}
        availableFilters={this.state.searchSchema}
      />
    )
  }
}

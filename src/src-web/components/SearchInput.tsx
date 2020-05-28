/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import { getCurrentTab } from '@kui-shell/core'
import SearchBar from './SearchBar'
import { SearchInputProps, SearchInputState } from '../model/SearchInput'
import strings from '../util/i18n'
import { isSearchAvailable } from '../controller/search';
import { getPluginState } from '../../pluginState'

export default class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
  static propTypes = { }
  constructor(props) {
    super(props)
    this.state = {
      searchSchema: [{id: 'loading', name: strings('search.loading'), disabled: true}],
    }
  }

  componentDidMount() {
    if (isSearchAvailable()) {
      getPluginState().searchSchema.length > 0
      ? this.setState({ searchSchema: getPluginState().searchSchema })
      : this.setState({ searchSchema: getPluginState().default })
    }
    else{
      getCurrentTab().REPL.pexec('search -i').then(() => this.setState({
        searchSchema: [{id: 'failed', name: strings('search.loading.fail'), disabled: true}]
      }))
    }
  }

  render() {
    return (
      <SearchBar
        onKeyPress={this.props.onKeyDown}
        value={this.props.value}
        onChange={this.props.onChange}
        availableFilters={this.state.searchSchema}
      />
    )
  }
}

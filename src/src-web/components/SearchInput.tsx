/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import HTTPClient from '../controller/HTTPClient'
import SearchBar from './SearchBar'
import { GET_SEARCH_SCHEMA } from '../definitions/search-queries'
import { SearchInputProps, SearchInputState } from '../model/SearchInput'
import strings from '../util/i18n'

export default class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
  static propTypes = { }
  constructor(props) {
    super(props)
    this.state = {
      searchSchema: [{id: 'loading', name: strings('search.loading'), disabled: true}],
    }
  }

  componentDidMount() {
    HTTPClient('post', 'search', GET_SEARCH_SCHEMA)
      .then((res) => {
        this.setState({ searchSchema: res.data.searchSchema })
      })
  }

  render() {
    return (
      <SearchBar
        onKeyDown={this.props.onKeyDown}
        value={this.props.value}
        onChange={this.props.onChange}
        availableFilters={this.state.searchSchema} />
    )
  }
}

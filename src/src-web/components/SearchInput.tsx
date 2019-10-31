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
import repl = require('@kui-shell/core/core/repl')
import strings from '../util/i18n'
import { getSearchService } from '../controller/search';

export default class SearchInput extends React.PureComponent<SearchInputProps, SearchInputState> {
  static propTypes = { }
  constructor(props) {
    super(props)
    this.state = {
      searchSchema: [{id: 'loading', name: strings('search.loading'), disabled: true}],
    }
  }

  componentDidMount() {
    const svc = getSearchService()

    svc.enabled && !svc.error
    ? HTTPClient('post', 'search', GET_SEARCH_SCHEMA)
      .then((res) => {
        this.setState({ searchSchema: res.data.searchSchema })
      })
      .catch((err) => { // It's possible for search to be installed, but not available.
        localStorage.setItem('search', `{
          "enabled": ${svc.enabled},
          "message": "${strings('search.service.available.error')}",
          "error": "${err}"
        }`)

        repl.pexec('search -i').then(this.setState({
          searchSchema: [{id: 'failed', name: strings('search.loading.fail'), disabled: true}]
        }))
      })
    : repl.pexec('search -i').then(this.setState({ // If search is unavailable or not enabled on the cluster, display the error message.
        searchSchema: [{id: 'failed', name: strings('search.loading.fail'), disabled: true}]
      }))
  }

  render() {
    return (
      <SearchBar
        onKeyDown={this.props.onKeyDown}
        value={this.props.value}
        onChange={this.props.onChange}
        availableFilters={this.state.searchSchema}
      />
    )
  }
}

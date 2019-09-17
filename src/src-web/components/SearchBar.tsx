/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import HTTPClient from '../controller/HTTPClient'
import { convertStringToQuery } from '../util/search-helper'
import { GET_SEARCH_COMPLETE } from '../definitions/search-queries'
import {SearchBarProps, SearchBarState} from '../model/SearchBar'
import InputTag from '../components/Tag'
import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-search')

const ReactTags = require('react-tag-autocomplete')

export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  static propTypes = {
    availableFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    tags: PropTypes.array,
    value: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      suggestions: [],
      currentQuery: 'search',
      currentTag: {
        field: '',
        matchText: [],
      },
      searchComplete: '',
      tags: [{
        id: 'id-search-label',
        key: 'key-search-label',
        name: 'search',
        value: 'search',
        disabled: true,
      }],
      fieldOptions: [{id: 'loading', name: strings('search.loading'), disabled: true}],
      chosenOperator: null,
      operators: ['=', '<', '>', '<=', '>=', '!=', '!'],
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleClearAllClick = this.handleClearAllClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.availableFilters, this.state.fieldOptions)) {
      const fields = this.formatFields(nextProps.availableFilters.allProperties)
      const labelTag = {
        id: 'id-filter-label',
        key: 'key-filter-label',
        name: strings('searchbar.filters.label'),
        value: strings('searchbar.filters.label'),
        disabled: true,
      }
      this.setState({
        fieldOptions: this.convertObjectToArray(fields, labelTag),
      })
    }

    if (nextProps.value === '') {
      this.setState({
        currentQuery: '',
        tags: [],
        currentTag: {
          field: '',
          matchText: [],
        },
        searchComplete: '',
      })
    } else if (nextProps.value !== '' && !_.isEqual(nextProps.value, this.state.currentQuery)) {
      const tagText = nextProps.value.trim().split(' ')
      const tags = tagText.map((tag) => {
        const semicolonIdx = tag.indexOf(':')
        const f = semicolonIdx > 0 ? tag.substring(0, semicolonIdx) : tag
        const matchText = semicolonIdx > 0 ? tag.substring(semicolonIdx + 1).split(',') : ''
        return {
          id: `id-${f}-tag`,
          key: `key-${f}-tag`,
          classType: semicolonIdx < 1 ? 'keyword' : '',
          name: tag,
          value: tag,
          field: f,
          matchText,
        }
      })
      const currentOperator = this.state.operators[this.state.operators.findIndex((op) => op === tags[tags.length - 1].matchText[0])] || null
      const field = ((tags[tags.length - 1].classType === 'keyword' || _.get(tags[tags.length - 1], 'matchText[0]', '') !== '') && currentOperator === null)
        ? ''
        : tags[tags.length - 1].field
      this.setState({
        currentQuery: nextProps.value.trim(),
        searchComplete: field,
        tags,
        chosenOperator: currentOperator || null,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps.availableFilters, nextState.fieldOptions)
  }

  componentWillUpdate(nextProps, nextState) {
    const { onChange } = this.props
    if (!_.isEqual(nextState.currentQuery, this.state.currentQuery)) {
      onChange(nextState.currentQuery)
    }
    if (!_.isEqual(nextState.currentTag, this.state.currentTag)
      && nextState.currentTag.field !== '') {
      // create new tag and add it to array
      const { currentTag: { field, matchText }, tags } = nextState
      const value = matchText !== undefined ? matchText : ''
      const tagText = field + ':' + value
      const tag = {
        id: `id-${field}-tag`,
        key: `key-${field}-tag`,
        name: tagText,
        value: tagText,
        field,
        matchText,
      }
      // need to replace the tag with new one
      const tagArray = matchText.length !== 0 ? tags.slice(0, tags.length - 1) : tags
      this.updateSelectedTags([...tagArray, tag], nextState.currentTag)
    }
  }

  convertObjectToArray(input, label) {
    if (Array.isArray(input)) {
      input.unshift(label)
      return input
    } else {
      let result = [label]
      Object.values(input).forEach((value) => {
        if (Array.isArray(value)) {
          Object.values(value).forEach((element) => {
            result = [...result, element]
          })
        }
      })
      return result
    }
  }

  formatFields(data) {
    return data.map((field) => {
      return {
        id: `id-${field}`,
        key: `key-${field}`,
        name: field,
        value: field,
      }
    })
  }

  formatSuggestionOptions(data) {
    const { chosenOperator, searchComplete, tags } = this.state
    const labelTag = {
      id: 'id-filter-label',
      key: 'key-filter-label',
      name: strings('searchbar.values.label', searchComplete),
      value: strings('searchbar.values.label', searchComplete),
      disabled: true,
    }

    interface Tag {
      field: string
      matchText: string[]
    }

    if (searchComplete !== '' && data && data.searchComplete) {
      // Filter out previously used labels
      if (tags.length > 1) {
        const kindTag: any = tags.slice(0, tags.length - 1).filter((tag: Tag) => tag.field === searchComplete)
        if (kindTag.length > 0) {
          data.searchComplete = data.searchComplete.filter((value) => kindTag[0].matchText.findIndex((item) => item === value) === -1)
        }
      }

      if (data.searchComplete.length === 0) {
        return [{
          id: 'id-no-results',
          name: strings('searchbar.no.suggestions'),
          disabled: true,
        }]
      } else {
        if (data.searchComplete[0] === 'isNumber') {
          if (chosenOperator !== null) {
            const rangeText = data.searchComplete.length > 2
              ? strings('searchbar.operator.range', data.searchComplete[1], data.searchComplete[2])
              : strings('searchbar.operator.range', data.searchComplete[1], data.searchComplete[1])
            return [
              labelTag,
              {
                id: 'id-values-range',
                key: 'key-values-range',
                name: rangeText,
                value: rangeText,
                disabled: true,
              },
            ]
          }
          return this.state.operators.map((operator) => {
            return {
              id: `id-operators-${operator}`,
              key: `key-operators-${operator}`,
              name: operator,
              value: operator,
            }
          })
        } else if (data.searchComplete[0] === 'isDate') {
          const dateOptions = ['hour', 'day', 'week', 'month', 'year']
          return this.convertObjectToArray(
            dateOptions.map((date) => {
              return {
                id: `id-date-${date}`,
                key: `key-date-${date}`,
                name: date,
                value: date,
              }
            }),
            {
              id: 'id-filter-label',
              key: 'key-filter-label',
              name: strings('searchbar.operator.dateSort', searchComplete),
              value: strings('searchbar.operator.dateSort', searchComplete),
              disabled: true,
            },
          )
        }
        return this.convertObjectToArray(
          data.searchComplete.map((item) => {
            return {
              id: `id-${item}`,
              key: `key-${item}`,
              name: item,
              value: item,
            }
          }),
          labelTag,
        )
      }
    } else {
      return [{id: 'loading', name: strings('search.loading'), disabled: true}]
    }
  }

  handleClearAllClick() {
    if (this.state.tags.length > 0) {
      this.updateSelectedTags([], {})
      this.setState({
        currentTag: {
          field: '',
          matchText: [],
        },
        searchComplete: '',
        chosenOperator: null,
      })
    }
  }

  handleDelete(i) {
    const { tags, searchComplete } = this.state
    if (tags.length > 0) {
      if (tags[i]['matchText'] === undefined // If tag only contains a filter value
      || (tags[i]['matchText'] && tags[i]['matchText'].length <= 1) // If tag contains a filter and only 1 filter type ex: (kind:pod)
      || (tags[i]['classType'] === 'keyword' && ((tags.length > 1 && tags[i]['value'] !== 'search') || tags.length === 1 && tags[i]['value'] === 'search'))) { // dont allow deletion of search tag if there are other tags being used
        const newTags = tags.filter((tag, index) => index !== i)
        const newQuery = newTags.map((tag) => tag['value']).join(' ')
        this.updateSelectedTags(newTags, {})
        this.setState({
          currentQuery: newQuery,
        })
        if (i !== tags.length - 1) {
          this.setState({
            searchComplete,
          })
        } else {
          this.setState({
            currentTag: {
              field: '',
              matchText: [],
            },
            searchComplete: '',
            chosenOperator: null,
            suggestions: [],
          })
        }
      } else if (tags[i]['matchText'] && tags[i]['matchText'].length > 1) {
        tags[i]['matchText'].pop()
        const tagText = tags[i]['field'] + ':' + tags[i]['matchText'].join(',')
        tags[i]['name'] = tagText
        tags[i]['value'] = tagText
        this.updateSelectedTags(tags, {})
      }
    }
  }

  updateSelectedTags(tags, currentTag) {
    const { field, matchText } = currentTag
    // This block handles combining two tags with the same filter field
    const lastTag = tags[tags.length - 1]
    if (lastTag && lastTag.matchText && lastTag.matchText.length > 0 && tags.length > 1) {
      let match = false
      // see if any tags have same field
      tags = _.map(tags.slice(0, tags.length - 1), (tag) => {
        if (tag.field === lastTag.field) {
          match = true
          tag.matchText = _.concat(tag.matchText, lastTag.matchText)
          const tagText = tag.field + ':' + tag.matchText.join(',')
          tag.name = tagText
          tag.value = tagText
        }
        return tag
      })
      if (!match) {
        tags.push(lastTag)
      }
    }
    if (field !== '' && matchText && matchText.length > 0 && this.state.operators.findIndex((op) => op === matchText[0]) === -1) {
      this.setState({
        currentTag: {
          field: '',
          matchText: [],
        },
        searchComplete: '',
        chosenOperator: null,
        suggestions: [],
      })
    }
    // Checks if the user has entered a space and deletes the newly created tag
    if (tags.length > 0 && (tags[tags.length - 1].name === '' || tags[tags.length - 1].name.charAt(0) === ' ')) {
      tags = tags.slice(0, tags.length - 1)
    }
    this.setState({
      currentQuery: tags.map((tag) => tag.value).join(' '),
      tags,
    })
  }

  handleAddition(input) {
    const {
      fieldOptions,
      searchComplete,
      tags,
      chosenOperator,
    } = this.state

    if (!searchComplete && !input.id) { // Adds keyword tag
      input.classType = 'keyword'
      input.value = input.name
      this.updateSelectedTags([...tags, input], {})
    } else {
      // Adds matchText string
      if (searchComplete && input.name && this.state.operators.findIndex((op) => op === input.name) > -1) {
        this.setState({
          chosenOperator: input,
          currentTag: {
            field: searchComplete,
            matchText: _.concat(input.name),
          },
          suggestions: [],
        })
      } else if (searchComplete) {
        this.setState({
          currentTag: {
            field: searchComplete,
            matchText: chosenOperator === null ? _.concat(input.name) : _.concat(chosenOperator.name + input.name),
          },
          chosenOperator: null,
        })
      } else {
        // Adds field if name matches available option (name, status, etc.) otherwise keyword
        input = fieldOptions.find((element) => element['name'] === input.name)
        if (input) {
          this.setState({ currentTag: { field: input.name, matchText: [] }, searchComplete: input.name })
        }
      }
    }
  }

  render() {
    const {
      currentQuery,
      fieldOptions,
      searchComplete = '',
      suggestions,
      tags,
    } = this.state

    let query = {keywords: [], filters: []}
    if (searchComplete !== '' && suggestions.length === 0) {
      query = convertStringToQuery(currentQuery)
      query.filters = query.filters.filter((filter) => {
        return filter.property !== searchComplete
      })
      HTTPClient('post', 'search', GET_SEARCH_COMPLETE(searchComplete, query))
      .then((res) => {
        this.setState({ suggestions: res.data })
      })
    }

    return (
      <div className='tagInput-filter'>
        <div className={'tagInput-comboBox'} onKeyDown={this.props.onKeyDown} >
          <ReactTags
            placeholder=''
            tags={tags}
            suggestions={searchComplete
              ? this.formatSuggestionOptions(suggestions)
              : fieldOptions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            tagComponent={InputTag}
            autoresize={false}
            minQueryLength={0}
            allowNew={true}
            delimiterChars={[' ', ':', ',']}
            delimiters={[9]}
            autofocus={true}
            maxSuggestionsLength= {Infinity}
          />
        </div>
      </div>
    )
  }
}

/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import { listen } from '@kui-shell/core/mdist/webapp/cli'
import { getCurrentTab } from '@kui-shell/core'
import SearchInput from './SearchInput'
import { InputFieldState, InputFieldProps } from '../model/InputField'
import { injectOurCSS } from '../util/injectOurCSS'

export class InputField extends React.PureComponent<InputFieldProps, InputFieldState> {
  constructor(props) {
    super(props)
    this.state = {
      inputText: '',
      reverseSearch: '',
      searchCheck: false,
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.reverseSearch === '' && this.state.reverseSearch.length > 0 ) {
      // User has canceled/exited reverse-i-search we need to re-listen to the prompt
      const prompt: HTMLInputElement = document.querySelector('.kui--input-stripe .repl-block .repl-input input')
      listen(prompt)
    }
  }

  componentDidMount() {
    injectOurCSS()
  }

  onKeyPress = (e) => {
    if (e.which === 38 || e.which === 40) {
      this.setState({ inputText: e.currentTarget.value })
    } else if (e.which !== 13 && e.currentTarget.value.startsWith('search ') && !this.state.searchCheck) {
      // If the user hit up/down and wants to edit command we need to trigger search first without altering the previous command
      this.toggleSearchCheckState(e.currentTarget.value)
    }
  }

  onKeyDown = async (e) => {
    const { inputText, searchCheck, reverseSearch } = this.state
    e.persist()
    if (e.which === 13) {
      this.setState({ searchCheck: false, inputText: e.target.value, reverseSearch: '' })
      // If user tries to run a i-search we need to set inputText to the reverse search
      if (reverseSearch !== '') {
        this.setState({ inputText: reverseSearch})
      } else if (searchCheck) {
        // grab any 'keyword/loose' text that has not been added to the official search string as a tag - we still need to run the command with this
        const unfinishedText = document.querySelector('.kui--input-stripe .repl-block .repl-input input')['value']
        const searchCommand = (inputText.endsWith(':') || inputText.endsWith(' ')) ? inputText + unfinishedText : inputText + ' ' + unfinishedText
        if (searchCommand.trim() === 'search') {
          await getCurrentTab().REPL.pexec('search -h')
        } else {
          await getCurrentTab().REPL.pexec(searchCommand)
        }
      }
    }
  }

  toggleSearchCheckState(inputText) {
    // If in i-search mode - set reverseSearch to the full string
    if (document.querySelector('.kui--input-stripe .repl-prompt-righty .repl-temporary')) {
      this.setState({ inputText, reverseSearch: document.querySelector('.kui--input-stripe .repl-prompt-righty .repl-temporary .repl-input-like').getAttribute('data-full-match') })
    } else if (inputText.startsWith('search ') && !this.state.searchCheck) {
      this.setState({ searchCheck: true, inputText, reverseSearch: '' })
    } else if (!inputText.startsWith('search') && this.state.searchCheck) {
      this.setState({ searchCheck: false, inputText, reverseSearch: '' }, () => {
        // Need to re-listen to the default searchbar because we removed it from the DOM when overriding with search
        const prompt: HTMLInputElement = document.querySelector('.kui--input-stripe .repl-block .repl-input input')
        listen(prompt)
      })
    } else {
      this.setState({ inputText, reverseSearch: '' })
    }
  }

  handleInputTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.toggleSearchCheckState(e.currentTarget.value)
  }

  handleSearchTextChange = (currentQuery) => {
    const query = currentQuery.replace(/:\s*/, ':')
    this.toggleSearchCheckState(query)
  }

  renderCommandInput() {
    return (
      <React.Fragment>
        <label className='repl-input-label' htmlFor='input-field'>input</label>
        <input
          id='input-field'
          type='text'
          onChange={this.handleInputTextChange}
          onKeyPress={this.onKeyDown}
          onKeyDown={this.onKeyPress}
          onPaste={this.handleInputTextChange}
          value={this.state.inputText}
          className='repl-input-element'
          autoFocus={true}
          autoComplete='off' autoCorrect='off' autoCapitalize='on' spellCheck={false}
          placeholder='enter your command' />
      </React.Fragment>

    )
  }

  renderSearchComponents() {
    return (
      <SearchInput
        onChange={this.handleSearchTextChange}
        value={this.state.inputText}
        onKeyDown={this.onKeyDown}
      />
    )
  }

  render() {
    const reverseSearch = document.querySelector('.kui--input-stripe .repl-prompt-righty .repl-temporary span')
      ? document.querySelector('.kui--input-stripe .repl-prompt-righty .repl-temporary span')['innerText'].includes('reverse-i-search')
      : false
    return (
      (this.state.searchCheck && !reverseSearch)
        ? this.renderSearchComponents()
        : this.renderCommandInput()
    )
  }
}

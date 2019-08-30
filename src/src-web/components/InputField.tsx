/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import { listen } from '@kui-shell/core/webapp/cli'
import SearchInput from './SearchInput'
import { InputFieldState, InputFieldProps } from '../model/InputField'
import { injectOurCSS } from '../util/injectOurCSS'

let repl
const importRepl = async () => {
  repl = await import('@kui-shell/core/core/repl')
}
importRepl()

export class InputField extends React.PureComponent<InputFieldProps, InputFieldState> {
  constructor(props) {
    super(props)
    this.state = {
      searchCheck: false,
      inputText: '',
    }
  }

  componentDidMount() {
    injectOurCSS()
  }

  onKeyDown = async (e) => {
    const { inputText, searchCheck } = this.state
    e.persist()
    if (e.which === 13) {
      this.setState({searchCheck: false, inputText: ''})
      
      if (searchCheck) {
        // grab any "keyword/loose" text that has not been added to the official search string as a tag - we still need to run the command with this
        const unfinishedText = document.querySelector('.kui--input-stripe .repl-block .repl-input input')['value']
        const searchCommand = inputText.endsWith(' ') ? inputText + unfinishedText : inputText + ' ' + unfinishedText
        if (searchCommand.trim() === 'search'){
          await repl.pexec('search -h')
        } else {
          await repl.pexec(searchCommand)
        }
      }
    }
  }

  toggleSearchCheckState(inputText) {
    if (inputText.startsWith('search ') && !this.state.searchCheck) {
      this.setState({ searchCheck: true, inputText })
    } else if (!inputText.startsWith('search') && this.state.searchCheck) {
      this.setState({ searchCheck: false, inputText }, () => {
        // Need to re-listen to the default searchbar because we reomved it from the DOM when overriding with search
        const prompt: HTMLInputElement = document.querySelector('.kui--input-stripe .repl-block .repl-input input')
        listen(prompt)
      })
    } else {
      this.setState({ inputText })
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
      <input
        type='text'
        onChange={this.handleInputTextChange}
        onKeyPress={this.onKeyDown}
        value={this.state.inputText}
        className='repl-input-element'
        autoFocus={true}
        autoComplete='off' autoCorrect='off' autoCapitalize='on' spellCheck={false}
        placeholder='enter your command' />
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
    return (
      this.state.searchCheck
        ? this.renderSearchComponents()
        : this.renderCommandInput()
    )
  }
}
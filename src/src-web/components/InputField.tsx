/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
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
    if (e.which === 13){
      this.setState({searchCheck: false, inputText: ''})
      if (searchCheck) {
        await repl.pexec(inputText)
      }
    }
  }

  toggleSearchCheckState(inputText) {
    if (inputText.startsWith('search ') && !this.state.searchCheck) {
      this.setState({ searchCheck: true, inputText })
    } else if (!inputText.startsWith('search') && this.state.searchCheck) {
      this.setState({ searchCheck: false, inputText })
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
      <div className='input-field'>
        {this.state.searchCheck
          ? this.renderSearchComponents()
          : this.renderCommandInput()}
      </div>
    )
  }
}

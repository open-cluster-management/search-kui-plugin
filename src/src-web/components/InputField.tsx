/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import { InputFieldState, InputFieldProps } from '../model/InputField'
import { injectOurCSS } from '../util/injectOurCSS'

let repl
const importRepl = async () => {
  repl = await import('@kui-shell/core/core/repl')
}
importRepl()

export class InputField extends React.PureComponent<InputFieldProps, InputFieldState> {
  constructor(props){
    super(props)
    this.state = {
      searchCheck: false,
      inputText:'',
    }
  }

  componentDidMount(){
    injectOurCSS()
  }

  onKeyPress = async (e) => {
    e.persist()
    if (e.which === 13) {
      const prompt: HTMLInputElement = document.querySelector('.kui--input-stripe input')
      this.setState({searchCheck:false})
      return await repl.doEval(({prompt}))
    }
  }

  handleInputTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({inputText: e.currentTarget.value})
    this.state.inputText.includes('search') ? this.setState({searchCheck: true}) : this.setState({searchCheck: false})
  }

  renderCommandInput(){
      return (
        <input
        type="text"
        onChange={e => this.handleInputTextChange(e)}
        onKeyPress={(e) => this.onKeyPress(e)}
        value={this.state.inputText}
        className="repl-input-element"
        autoFocus={true}
        autoComplete="off" autoCorrect="off" autoCapitalize="on"
        placeholder="ENTER COMMANDS" />
      )
    }

  renderSearchComponents(){
      return (
        <input
        type="text"
        onChange={e => this.handleInputTextChange(e)}
        onKeyPress={(e) => this.onKeyPress(e)}
        value={this.state.inputText}
        className="repl-input-element"
        autoFocus={true}
        autoComplete="off" autoCorrect="off" autoCapitalize="on"
        placeholder="ENTER COMMANDS" />
      )
  }


  render() {

    return (
      <div className='input-field'>
        {!this.state.searchCheck
          ? this.renderCommandInput()
          : this.renderSearchComponents()}
      </div>
    )
  }
}
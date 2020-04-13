/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { InputField } from './InputField'
import { ChevronRight24 } from '@carbon/icons-react'

export const InputWrapper = (node: HTMLElement) => {
  const Component = () => {
    return (
      <div className='repl-block' data-base-class='repl-block'>
        <div className='repl-input'>
          <div className='repl-prompt'>
            <span className='repl-prompt-lefty' />
            <span className='repl-context' />
            <span className='repl-selection clickable' title='The current selection' />
            <span className='repl-prompt-righty'>
              <ChevronRight24/>
            </span>
          </div>
          <InputField/>
        </div>
      </div>
    )
  }
  return ReactDOM.render(React.createElement(Component), node)
}
 
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
import ResourceTable from '../components/ResourceTable'

import repl = require('@kui-shell/core/core/repl')

export default function renderReact(data: any[], node: HTMLDivElement, command: string) {
  const uniqueKinds = [...new Set(data.map((item) => item.kind))]
  const searchResource = command.includes(':') ? () => {
    return (
      <div className={'search--resource'}>
        <div className={'related--resource-table-header'}>
          <div>
            <button
              onClick={() => {
                if (command.includes(':')) {
                  repl.pexec(command.replace('search ', 'search related:resources '))
                }
              }}
              className={'related--resource-table-header-button'}>
              {`View related resources  >`}
            </button>
          </div>
        </div>
        { uniqueKinds.map((kind) => (
          <div className={'search--resource-table'} key={kind}>
          <ResourceTable
            items={data.filter((item) => item.kind === kind || item.__type === kind )}
            kind={ kind }/>
        </div>
        ))}
      </div>
    )
  }
  : () => {
    return (
      <div className={'search--resource'}>
        { uniqueKinds.map((kind) => (
          <div className={'search--resource-table'} key={kind}>
          <ResourceTable
            items={data.filter((item) => item.kind === kind || item.__type === kind )}
            kind={ kind }/>
        </div>
        ))}
      </div>
    )
  }
  ReactDOM.render(React.createElement(searchResource), node)
  return node
}

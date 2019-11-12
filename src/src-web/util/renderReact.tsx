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
import strings from './i18n'

export default function renderReact(data: any, node: HTMLDivElement, command: string) {
  const uniqueKinds = [...new Set(data.items ? data.items.map((item) => item.kind) : data.map((item) => item.kind))]
  const searchResource = () => {
    return (
      <div className={'search--resource'}>
        {data.related && data.related.length > 0 && command.includes(':')
          ? <div className={'related--resource-table-header'}>
              <button
                onClick={() => {
                  repl.pexec(command.replace('search ', 'search related:resources '))
                }}
                className={'related--resource-table-header-button'}>
                {<div className={'linked-resources'}>{strings('search.label.view.related')}</div>}
                {<span className={'arrow-right'}>&rarr;</span>}
              </button>
            </div>
          : null
        }
        {uniqueKinds.map((kind) => (
          <div className={'search--resource-table'} key={kind.toString()}>
            <ResourceTable
              items={data.items
                ? data.items.filter((item) => item.kind === kind || item.__type === kind )
                : data.filter((item) => item.kind === kind || item.__type === kind )}
              kind={ kind.toString() }
            />
          </div>
        ))}
      </div>
    )}

  ReactDOM.render(React.createElement(searchResource), node)
  return node
}

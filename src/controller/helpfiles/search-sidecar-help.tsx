
/*
 * Copyright (c) 2020 Red Hat, Inc.
 */
// Copyright Contributors to the Open Cluster Management project

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { getCurrentTab } from '@kui-shell/core'
import { Copy24 } from '@carbon/icons-react'

export const getTableContent = (data) => {
  const node = document.createElement('div')
  node.classList.add('bx--data-table-container')

  const content = () => {
    return (
      <table className="bx--data-table bx--data-table--short bx--data-table--no-border">
        <thead>
          <tr className="bx--data-table--compact">
            {data.headers.map((res) => {
              return (
                <th key={res.key}>{res.header.toUpperCase()}</th>
              )})
            }
          </tr>
        </thead>
        <tbody>
          {data.rows.map((res) => {
            return (
              <tr className="bx--data-table--compact" key={res.name}>
                <td onClick={() => getCurrentTab().REPL.pexec(res.command)}>{res.name}</td>
                <td>{res.docs}</td>
              </tr>
            )})
          }
        </tbody>
      </table>
    )
  }
  
  ReactDOM.render(React.createElement(content), node)
  return node
}

/**
 * Render introduction tab for the search plugin helper model
 * 
 */
export const getIntroduction = (data) => {
  const node = document.createElement('div')
  const content = () => {
    return (
      <div>
        {data.map((res) => {
          return (
            <div key={res.header}>
              <h3 className={`${res.header.toLowerCase()}-header`}><strong>{res.header}</strong></h3>
              <p>{res.docs}</p>
              {res.usage ? <div className='bx--snippet bx--snippet--single search'>{res.usage}<Copy24 className={'copy-btn'}/></div> : null }
            </div>
            )
          })
        }
      </div>
    )
  }
  ReactDOM.render(React.createElement(content), node)
  return node
}

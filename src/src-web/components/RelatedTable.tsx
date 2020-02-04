/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent){
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

import * as React from 'react'
import * as PropTypes from 'prop-types'

import { DataTable } from 'carbon-components-react'
import { TableProps, TableState } from '../model/RelatedTable'
import { getCurrentTab } from '@kui-shell/core'

const { Table, TableRow, TableBody, TableCell } = DataTable

export default class RelatedTable extends React.PureComponent<TableProps, TableState> {
  static propTypes = {
    items: PropTypes.array,
    kind: PropTypes.array,
    command: PropTypes.any,
  }

  constructor(props) {
    super(props)
    this.getHeaders = this.getHeaders.bind(this)
    this.getRows = this.getRows.bind(this)
  }

  getHeaders() {
    const resource = [{
      key: 'kind',
      header: 'kind',
    }, {
      key: 'count',
      header: 'count',
    }]
    const headers = resource
    return headers
  }

  getRows() {
    const { items } = this.props

    return items.map((record, i) => {
      const row = { id: i.toString(), ...record }
      return row
    })
  }

  render() {
    return (
      <React.Fragment>
        <DataTable
          rows={this.getRows()}
          headers={this.getHeaders()}
          render={({ rows, headers }) => {
            return (
              <Table>
                <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className='bx--data-table--related'>
                    {row.cells.map((cell) => <TableCell key={cell.id} onClick={() => {
                      const result = this.props.items.filter((r) => r.kind.includes(cell.value))
                      let command = `search kind:${cell.value} name:`

                      result[0].items.forEach((element) => {
                        command += `${element.name},`
                      });

                      getCurrentTab().REPL.pexec(command.substring(0, command.length - 1))
                    }}>
                      {cell.value}</TableCell>)}
                  </TableRow>))}
                </TableBody>
              </Table>
            )}}
        />
        </React.Fragment>
    )
  }
}

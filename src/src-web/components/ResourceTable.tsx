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
import * as lodash from 'lodash'
import * as PropTypes from 'prop-types'
import tableDefinitions from '../definitions/search-definitions'
import Modal from '../components/Modal'
import { Pagination, DataTable, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { TableProps, TableState } from '../model/ResourceTable'
import repl = require('@kui-shell/core/core/repl')
import strings from '../util/i18n'

const { Table, TableHead, TableRow, TableBody, TableCell } = DataTable
const PAGE_SIZES = { DEFAULT: 10, VALUES: [5, 10, 20, 50, 75, 100] }

export default class ResourceTable extends React.PureComponent<TableProps, TableState> {
  static propTypes = {
    collapseTable: PropTypes.bool,
    expandFullPage: PropTypes.bool,
    items: PropTypes.array,
    kind: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = {
      itemToDelete: {},
      page: 1,
      pageSize: PAGE_SIZES.DEFAULT,
      sortDirection: 'asc',
      selectedKey: '',
      modalOpen: false,
      collapse: false,
    }

    this.getHeaders = this.getHeaders.bind(this)
    this.getRows = this.getRows.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      collapse: nextProps.collapseTable,
    })
  }

  toggleCollapseTable = () => {
    this.setState(({collapse}) => {
      return { collapse: !collapse }
    })
  }

  getHeaders() {
    const { kind } = this.props
    const resource = tableDefinitions[kind] || tableDefinitions['genericresource']
    const headers = resource.columns.map((col) => ({
      key: col.key, header: strings(`table.header.${col.msgKey || col.key}`),
    }))
    headers.push({ key: 'action', header: ''})
    return headers
  }

  getRows() {
    let { items } = this.props
    const { kind } = this.props
    let transforms = tableDefinitions[kind] || tableDefinitions['genericresource']
    const { page, pageSize, selectedKey, sortDirection } = this.state

    if (selectedKey) {
      items = lodash.orderBy(items, [selectedKey], [sortDirection])
    }
    const startItem = (page - 1) * pageSize
    const visibleItems = items.slice(startItem, startItem + pageSize)
    // Get all the transforms for current kind defined in search-definitions
    transforms = transforms.columns.filter((rowCol) => rowCol.transform)

    return visibleItems.map((item, i) => {
      const row = { id: i.toString(), action: null, ...item }

      // Transform each key that has a transform and assign it back to the row item
      if (transforms.length > 0) {
        transforms.forEach((transform) => {
          // NOTE - this will only work for getAge transfrom currently
          row[transform.key] = transform.transform(item, null, transform.key)
        })
      }

      if (this.props.kind !== 'cluster' && this.props.kind !== 'release') {
        const action = 'table.actions.remove'
        row.action = (
          <OverflowMenu flipped iconDescription={strings('svg.description.overflowMenu')} ariaLabel='Overflow-menu'>
            <OverflowMenuItem
              data-table-action={action}
              isDelete={true}
              onClick={() => this.setState({ itemToDelete: item, modalOpen: true })}
              key={action}
              itemText={strings('table.actions.remove.resource', [kind])} />
          </OverflowMenu>
        )
      }
      return row
    })
  }

  handleSort = (selectedKey) => () => {
    if (selectedKey) {
      this.setState((preState) => {
        return {selectedKey, sortDirection: preState.sortDirection === 'asc' ? 'desc' : 'asc' }
      })
    }
  }

  render() {
    const { page, pageSize, sortDirection, selectedKey, modalOpen, collapse } = this.state
    const totalItems = this.props.items.length
    const sortColumn = selectedKey

    return (
      <React.Fragment>
        <div className={'search--resource-table-header'}>
          <div>
            { 
              <button
                onClick={this.toggleCollapseTable}
                className={'search--resource-table-header-button'}>
                {<span className={'linked-resources'}>{`${this.props.kind}(${this.props.items.length})`}</span>}
                {!collapse ? <span className={'arrow-up'}>&#9650;</span> : <span className={'arrow-down'}>&#9660;</span>}
              </button>
            }
          </div>
        </div>
        {!collapse
      ? <React.Fragment>
        <DataTable
          key={`${this.props.kind}-resource-table`}
          rows={this.getRows()}
          headers={this.getHeaders()}
          render={({ rows, headers }) => {
            return (
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <th scope={'col'} key={header.key}>
                        {header.key !== 'action'
                          ? <div
                              onClick={this.handleSort(header.key)}
                              className={`bx--table-sort-v2${sortDirection === 'asc' ? ' bx--table-sort-v2--ascending' : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`}
                              data-key={header.key} >
                              <span className='bx--table-header-label'>{header.header}<span className={'arrow-down-header-label'}>&#9660;</span></span>
                            </div>
                          : null}
                      </th>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className='bx--data-table--compact'>
                      {row.cells.map((cell) => <TableCell key={cell.id} onClick={() => {
                        const _ = row.cells.filter((data) => data.info.header === 'namespace')
                        if (this.props.kind === 'savedSearches' && cell.info['header'] === 'name') {
                          // When user clicks on saved search name we want to run the query seen in search text column
                          return repl.pexec(`search ${row.cells[2].value}`)
                        } else if (cell.info['header'] === 'name' && _.length > 0 && _[0].value) {
                          return repl.pexec(`search summary kind:${this.props.kind} name:${cell.value} namespace:${row.cells[1].value}`)
                        } else if (cell.info['header'] === 'name') {
                          return repl.pexec(`search summary kind:${this.props.kind} name:${row.cells[0].value}`)
                        } else {
                          return null
                        }
                      }}>{cell.value}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          }
        />

        {
          this.props.items.length > PAGE_SIZES.DEFAULT
          ? <Pagination
              key='resource-table-pagination'
              id='resource-table-pagination'
              onChange={(pagination) => this.setState(pagination)}
              pageSize={pageSize}
              pageSizes={PAGE_SIZES.VALUES}
              totalItems={totalItems}
              page={page}
              disabled={pageSize >= totalItems}
              isLastPage={pageSize >= totalItems}
              itemsPerPageText={strings('pagination.itemsPerPage')}
              pageRangeText={(current, total) => strings('pagination.pageRange', [current, total])}
              itemRangeText={(min, max, total) => `${strings('pagination.itemRange', [min, max])} ${strings('pagination.itemRangeDescription', [total])}`}
              pageInputDisabled={pageSize >= totalItems}
            />
          : null
        }

        </React.Fragment>
        : null }

        <Modal
          item={this.state.itemToDelete}
          modalOpen={modalOpen}
          onClose={() => this.setState({ modalOpen: false })} />
      </React.Fragment>
    )
  }
}

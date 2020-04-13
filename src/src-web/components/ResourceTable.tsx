/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent) {
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

import * as React from 'react'
import * as lodash from 'lodash'
import * as PropTypes from 'prop-types'
import tableDefinitions from '../definitions/search-definitions'
import Modal from '../components/Modal'
import { Pagination, DataTable } from 'carbon-components-react'
import { TableProps, TableState } from '../model/ResourceTable'
import { getCurrentTab } from '@kui-shell/core'
import strings from '../util/i18n'
import { Delete16, Edit16, Share16 } from '@carbon/icons-react'
import { getStatusIcon } from '../util/status'

const { Table, TableHead, TableRow, TableBody, TableCell } = DataTable
const PAGE_SIZES = { DEFAULT: 10, VALUES: [5, 10, 20, 50, 75, 100] }

export default class ResourceTable extends React.PureComponent<TableProps, TableState> {
  static propTypes = {
    collapseTable: PropTypes.bool,
    expandFullPage: PropTypes.bool,
    items: PropTypes.array,
    kind: PropTypes.string,
  }

  tabHeaders = ['name', 'action', 'share', 'edit']

  constructor(props) {
    super(props)
    this.state = {
      action: '',
      itemForAction: {},
      page: 1,
      pageSize: PAGE_SIZES.DEFAULT,
      sortDirection: 'asc',
      selectedKey: '',
      modalOpen: false,
      collapse: false,
    }

    this.getHeaders = this.getHeaders.bind(this)
    this.getRows = this.getRows.bind(this)
    this.handleEvent = this.handleEvent.bind(this)
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

    if (kind === 'savedSearches') {
      headers.push({ key: 'edit', header: '' })
      headers.push({ key: 'share', header: '' })
    }

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
        row.action = (
          <Delete16
            className='table-action'
            onClick={() => this.setState({ itemForAction: item, modalOpen: true, action: 'remove' })}
          />
        )

        if (kind === 'savedSearches') {
          row['share'] = (
            <Share16
              className='table-action'
              onClick={() => this.setState({ itemForAction: item, modalOpen: true, action: 'share' })}
            />
          )

          row['edit'] = (
            <Edit16
              className='table-action'
              onClick={() => this.setState({ itemForAction: item, modalOpen: true, action: 'edit' })}
            />
          )
        }
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

  handleEvent = (row, cell, e?) => {
    if ((e && e.which === 13) || !e) {
      const item = this.props.items.filter((data) => data['name'] === lodash.get(row, '[0].value', ''))

      switch (cell.info['header']) {
        case 'action':
          this.setState({ itemForAction: lodash.get(item, '[0]', ''), modalOpen: true, action: 'remove' })
          break
        case 'edit':
          this.setState({ itemForAction: lodash.get(item, '[0]', ''), modalOpen: true, action: 'edit' })
          break
        case 'share':
          this.setState({ itemForAction: lodash.get(item, '[0]', ''), modalOpen: true, action: 'share' })
          break
        default:
          const headers = ['name', 'namespace', 'cluster'] // Headers used for filters keywords
          let filters = '' // Query filters

          // Since multiple resources can have the same name, get the namespace and cluster name for that resource
          const _ = row.filter((data) => (data && data.value && (headers.includes(data.info['header']))))

          _.forEach((data) => {
            filters += `${data.info['header']}:${data.value} `
          })

          if (this.props.kind === 'savedSearches' && cell.info['header'] === 'name') {
            // When user clicks on saved search name we want to run the query seen in search text column
            return getCurrentTab().REPL.pexec(`search ${row[2].value}`)
          } else if (cell.info['header'] === 'name' && filters) {
            return getCurrentTab().REPL.pexec(`search summary kind:${this.props.kind} ${filters}`)
          } else {
            return null
          }
      }
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
            <button
              onClick={this.toggleCollapseTable}
              className={'search--resource-table-header-button'}>
              {<span className={'linked-resources'}>{`${this.props.kind}(${this.props.items.length})`}</span>}
              {!collapse ? <span className={'arrow-up'}>&#9650;</span> : <span className={'arrow-down'}>&#9660;</span>}
            </button>
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
                              <span className='bx--table-header-label'>{header.header}
                                <span className={'arrow-header-label'}>{this.state.sortDirection === 'asc'
                                  ? <span>&#9650;</span>
                                  : <span>&#9660;</span>
                                }</span>
                              </span>
                            </div>
                          : null
                        }
                      </th>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className='bx--data-table--compact'>
                      {row.cells.map((cell) => <TableCell
                        onKeyPress={(e) => this.handleEvent(row.cells, cell, e)}
                        tabIndex={this.tabHeaders.includes(cell.info['header']) ? 0 : null}
                        key={cell.id}
                        onClick={() => this.handleEvent(row.cells, cell) }
                        >
                      {
                        cell.info['header'] !== 'status'
                        ? cell.value
                        : <div>
                            { // If the resource contains a status, add a status icon to that column in the table.
                              getStatusIcon(cell.value)
                            }
                            <span className={`status-name`}>{`${cell.value}`}</span>
                          </div>
                      }
                      </TableCell>)}
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
          item={this.state.itemForAction}
          modalOpen={modalOpen}
          onClose={() => this.setState({ itemForAction: {}, modalOpen: false, action: '' })}
          action={this.state.action}
        />
      </React.Fragment>
    )
  }
}

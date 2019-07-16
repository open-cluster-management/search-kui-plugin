/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
Object.defineProperty(window, 'navigator', { value: { userAgent: 'node' }, writable: true })
Object.defineProperty(document, 'getElementById', { value: (val: String) => document.querySelector('#' + val), writable: true })

import * as React from 'react'
import * as lodash from 'lodash'
import * as PropTypes from 'prop-types'
import tableDefinitions from '../definitions/search-definitions'
// import msgs from '../../nls/search.properties'
import constants from '../../lib/shared/constants'

import { Pagination, DataTable, OverflowMenu, OverflowMenuItem, Modal } from 'carbon-components-react'
import { TableProps, TableState } from '../model/ResourceTable'

const { Table, TableHead, TableRow, TableBody, TableCell } = DataTable
const PAGE_SIZES = { DEFAULT: 10, VALUES: [5, 10, 20, 50, 75, 100] }

export default class ResourceTable extends React.PureComponent<TableProps, TableState> {
  static propTypes = {
    collapseTable: PropTypes.bool,
    expandFullPage: PropTypes.bool,
    items: PropTypes.array,
    kind: PropTypes.string,
  }

  constructor(props){
    super(props)
    this.state = {
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
    collapse: nextProps.collapseTable
  })
}

toggleCollapseTable = () => {
  this.setState(({collapse}) => {
    return { collapse: !collapse }
  })
}

  getHeaders() {
    const { kind } = this.props
    // console.log('kind(s)', kind)
    const resource = tableDefinitions[kind] || tableDefinitions['genericresource']
    console.log('RESOURCE FOR HEADERS', resource)
    const headers = resource.columns.map(col => ({
    key: col.key, header: col.key
  }))
  headers.push({ key: 'action', header: ''})
  return headers
  }

  getRows(){
    const { page, pageSize, selectedKey, sortDirection } = this.state
    let { items } = this.props
    const { kind } = this.props

    if (selectedKey) {
    items = lodash.orderBy(items, [selectedKey], [sortDirection])
    }
    const startItem = (page - 1) * pageSize
    const visibleItems = items.slice(startItem, startItem + pageSize)
    return visibleItems.map((item, i) => {
      // const { namespace, name, cluster, selfLink } = item
      const action ='table.actions.remove'
      const row = { id: i.toString(), action: null, ...item }
      const resource = tableDefinitions[kind] || tableDefinitions['genericresource']
      // const link = '#'
      // resource.columns.forEach(column => {
      //   if (column.key === 'name') {
      //     row[column.key] = link.pathname
      //       ? <Link to={{ pathname: link.pathname, search: link.search }}>{name}</Link>
      //       : <a href={link}>{name}</a>

      //   } else {
      //     row[column.key] = column.transform ? column.transform(item, this.context.locale) : (item[column.key] != undefined ? item[column.key] : '-')
      //   }
      // })
      row.action = (
        <OverflowMenu floatingMenu flipped iconDescription={'Menu'} ariaLabel='Overflow-menu'>
          <OverflowMenuItem
            data-table-action={action}
            isDelete={true}
            onClick={() => this.setState({ modalOpen: true })}
            key={action}
            itemText={'Delete'} />
        </OverflowMenu>
      )
      return row
    })
  }

  handleSort = (selectedKey) => () => {
    if (selectedKey) {
      this.setState(preState => {
        return {selectedKey: selectedKey, sortDirection: preState.sortDirection === 'asc' ? 'desc' : 'asc' }
      })
    }
  }

//  getDetailsLink(item) {
//   const { kind } = this.props
//   switch (kind){
//   case 'cluster':
//     return {
//       pathname: `${config.contextPath}/clusters`,
//       search: `?filters={"textsearch":["${item.name}"]}`
//     }
//   case 'application':
//     return {
//       pathname: `${config.contextPath}/applications/${item.namespace}/${item.name}`,
//       search: ''
//     }
//   case 'release':
//     return item.cluster === 'local-cluster' // TODO - better method of determining hub-cluster
//       ? `/catalog/instancedetails/${item.namespace}/${item.name}`
//       : '/catalog/instances'
//   case 'policy':
//     return `/policy/policies/${item.namespace}/${item.name}/compliancePolicy/${item.namespace}/`
//   case 'compliance':
//     return `/policy/policies/${item.namespace}/${item.name}`
//   default:
//     return {
//       pathname: `${config.contextPath}/details/${item.cluster}${item.selfLink}`,
//       search: ''
//     }
//   }
// }

  render() {
    const { page, pageSize, sortDirection, selectedKey, modalOpen, collapse } = this.state
    const totalItems = this.props.items.length
    const sortColumn = selectedKey

    return (
      <React.Fragment>
        <div className={'search--resource-table-header'}>
          { // !this.props.related ?
            <div>
              <button
                onClick={this.toggleCollapseTable}
                className={'search--resource-table-header-button'} >
                {`${this.props.kind} (${this.props.items.length})`}
                {/* <Icon
                  className='search--resource-table-header-button-icon'
                  name={collapse ? 'caret--down' : 'caret--up'}
                  description={msgs.get(collapse ? 'table.header.search.expand' : 'table.header.search.collapse', this.context.locale)} /> */}
              </button>
            </div>
            //:
            // `${msgs.get('table.header.search.related', [this.props.kind])} (${this.props.items.length})`
            //`${this.props.kind}(${this.props.items.length})`
          }
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
                    {headers.map(header => (
                      <th scope={'col'} key={header.key}>
                        {header.key !== 'action'
                          ? <button
                            // title={msgs.get(`svg.description.${!sortColumn || sortDirection === 'desc' ? 'asc' : 'desc'}`, this.context.locale)}
                            onClick={this.handleSort(header.key)}
                            className={`bx--table-sort-v2${sortDirection === 'asc' ? ' bx--table-sort-v2--ascending' : ''}${sortColumn === header.key ? ' bx--table-sort-v2--active' : ''}`}
                            data-key={header.key} >
                              <span className='bx--table-header-label'>{header.header}</span>

                              </button>
                          : null
                        }
                      </th>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          }
        />

        <Pagination
          key='resource-table-pagination'
          id='resource-table-pagination'
          onChange={(pagination) => this.setState(pagination)}
          pageSize={pageSize}
          pageSizes={PAGE_SIZES.VALUES}
          totalItems={totalItems}
          page={page}
          disabled={pageSize >= totalItems}
          isLastPage={pageSize >= totalItems}
          // itemsPerPageText={msgs.get('pagination.itemsPerPage', this.context.locale)}
          // pageRangeText={(current, total) => msgs.get('pagination.pageRange', [current, total], this.context.locale)}
          // itemRangeText={(min, max, total) => `${msgs.get('pagination.itemRange', [min, max], this.context.locale)} ${msgs.get('pagination.itemRangeDescription', [total], this.context.locale)}`}
          pageInputDisabled={pageSize >= totalItems}
        />

        <Modal
          open={modalOpen}
          danger={true}
          onRequestClose={() => this.setState({ modalOpen: false })}
          onRequestSubmit={() => this.setState({ modalOpen: false })}
          modalHeading={'KUI Modal Example'}
          primaryButtonText={'Submit'}
          secondaryButtonText={'Close'}>
          <div>
              *** ADD MESSAGING
          </div>
        </Modal>
        </React.Fragment>
        : null }
      </React.Fragment>
    )
  }
}

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
// import SearchResult from '../components/SearchResult'

export default function renderReact(data: Array<any>, node: HTMLDivElement) {
  const uniqueKinds = [...new Set(data.map(item => item.kind))]
  const searchResource = () => {
    return (
      <div className={'search--resource'}>
        { uniqueKinds.map((kind)=> (
          <div className={'search--resource-table'} key={kind}>
          <ResourceTable
            items={data.filter(item => item.kind === kind || item.__type === kind )}
            kind={ kind }/>
        </div>
        ))}
      </div>
    )
  }

  ReactDOM.render(React.createElement(searchResource), node)

  return node

}


/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as ReactDOM from 'react-dom';
import * as React from 'react';
import RelatedTable from '../../components/RelatedTable';

export const relatedTab = (related: any) => new Promise((resolve, reject) => {
  const node = document.createElement('div', {is: 'search-sidecar-related'})

  const uniqueKinds = [...new Set(related.map(item => item.kind))] // returns unique kinds from the data <-> creates an array of strings
  const count = related.map(item => item.count)

    const relatedResource = related.length !== 0 ? () => {
      return(
        <div className={'related--resource'}>
          <RelatedTable
            items={related}
            kind={uniqueKinds}
            count={count}
          />
        </div>
      )}
      :() => {
        return (
          <div className={'related--resource'}>
            <table className={'bx--data-table bx--data-table--no-border'}>
              <tbody>
                <tr className={'bx--data-table--related'}>
                  <td>
                    {'Results for Related Resources'}
                  </td>
                  <td>
                    {'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
      
    node.classList.add('custom-content')
    ReactDOM.render(React.createElement(relatedResource), node)
    resolve(node)
})
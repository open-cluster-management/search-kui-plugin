/* eslint-disable @typescript-eslint/no-explicit-any */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import lodash from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import {
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Button
} from 'carbon-components-react'
import { getCurrentTab, doEval } from '@kui-shell/core'
import strings from '../../util/i18n'

const handleEvent = (resource: any, event?: any) => {
  const clusters = lodash.get(resource, 'items', '').map((res) => res.cluster)

  if ((event && event.which === 13) || !event) {
    let command = `search kind:${lodash.get(resource, 'kind', '')} `

    if (clusters && lodash.get(resource, 'kind', '') !== 'cluster') {
      // Include cluster name when returning the related data.
      command += `cluster:${clusters.toString()} name:`
    } else {
      command += 'name:'
    }

    lodash.get(resource, 'items', '').forEach((item: any) => {
      command += `${item.name},`
    })
    doEval(getCurrentTab(), undefined, `${command.substring(0, command.length - 1)}`)
    // getCurrentTab().REPL.pexec(command.substring(0, command.length - 1))
  }
}

/**
 * Renders a structured list of related resources for the selected resource's sidecar.
 * @param related
 */
export const buildRelated = (data: any, type?: string) => {
  const node = document.createElement('div')
  node.classList.add('scrollable')
  node.classList.add(type !== 'query' ? 'bx--structured-list--summary' : 'bx--tile-related')

  const cluster = lodash.get(data, 'items[0].cluster', '')
  const relatedResource =
    type !== 'query'
      ? () => {
          return (
            <StructuredListWrapper>
              <StructuredListBody>
                {data.map((row: any) => (
                  <StructuredListRow key={`${row.kind}`} className="bx--structured-list-rowclick">
                    <StructuredListCell
                      tabIndex={0}
                      onKeyPress={e => handleEvent(row, e)}
                      onClick={() => handleEvent(row)}
                    >
                      <span className="bx--structured-list-td-related-header">{`${row.items.length}`}</span>
                      <br></br>
                      <span className="bx--structured-list-td-body">{`Related ${row.kind}`}</span>
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          )
        }
      : () => {
          return data.map((row: any) => (
            <Button
              className={`${row.kind}-related-button`}
              tabIndex={0}
              key={row.kind}
              onClick={() => handleEvent(row, cluster)}
              onKeyPress={(e: any) => handleEvent(row, e)}
              type="button"
            >
              <div className="bx--tile-container">
                <span className="bx--structured-list-td-related-header">{`${row.items.length}`}</span>
                <br></br>
                <span className="bx--structured-list-td-body">{`Related ${row.kind}`}</span>
              </div>
            </Button>
          ))
        }

  ReactDOM.render(React.createElement(relatedResource), node)
  return node
}

/**
 * Renders a related tab for the selected resource's || search query's sidecar.
 * @param resource
 * @param type
 */
export const relatedTab = (data: any, type?: string) => {
  return {
    mode: 'related',
    label: strings('search.label.related'),
    order: 9999,
    content: buildRelated(data.related, type)
  }
}

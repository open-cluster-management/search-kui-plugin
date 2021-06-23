/*******************************************************************************
 *
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project

import React from 'react'
import ResourceTable from '../components/ResourceTable'
import { pexecInCurrentTab } from '@kui-shell/core'
import strings from './i18n'

export default function renderReact( data: any, node: HTMLDivElement, command: string, wrapperClassName?: string) {
  const uniqueKinds = [...new Set(data.items ? data.items.map(item => item.kind) : data.map(item => item.kind)),]

  const searchResource = () => {
    return (
      <div className={wrapperClassName}>
        <div className={'search--resource'}>
          {data.related && data.related.length > 0 && command.includes(':') ? (
            <div className={'related--resource-table-header'}>
              <button
                onClick={() => {
                  console.log('button', command)
                  pexecInCurrentTab(
                    `split --ifnot is-split --cmdline "${command.concat(' --related')}"`,
                    undefined,
                    false,
                    true
                  )
                }}
                className={'related--resource-table-header-button'}
              >
                {<div className={'linked-resources'}>{strings('search.label.view.related')}</div>}
                {<span className={'arrow-right'}>&rarr;</span>}
              </button>
            </div>
          ) : null}
          {uniqueKinds.map(kind => (
            <div className={'search--resource-table'} key={kind.toString()}>
              <ResourceTable
                items={
                  data.items ? data.items.filter(item => item.kind === kind) : data.filter(item => item.kind === kind)
                }
                kind={kind.toString()}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return { react: React.createElement(searchResource) }
}

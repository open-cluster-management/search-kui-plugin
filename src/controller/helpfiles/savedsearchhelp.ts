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

import strings from '../../util/i18n'
import { NavResponse } from '@kui-shell/core'
import { getIntroduction } from './search-sidecar-help'

const contentType = 'text/html'
const apiVersion = 'kui-shell/v1'
const kind = 'NavResponse'

const sections = {
  introduction: {
    headers: [
      {
        header: strings('validation.about'),
        docs: strings('savedsearchhelp.title'),
        key: strings('validation.about')
      },
      {
        header: strings('validation.usage'),
        docs: strings('savedsearchhelp.header'),
        key: strings('validation.usage'),
        usage: `savedsearches (alias: ss)`
      },
      {
        header: strings('validation.guide'),
        docs: strings('validation.savedsearches.parameters'),
        key: strings('validation.guide')
      }
    ]
  }
}

/**
 * Usage model for the savedsearches plugin
 *
 */
export function usage(): NavResponse {
  return {
    apiVersion,
    kind,
    breadcrumbs: [{ label: 'savedsearches' }],
    menus: [{
      label: strings('validation.usage'),
      items: [{
        mode: strings('validation.introduction'),
        content: getIntroduction(sections.introduction.headers),
        contentType
      }]
    }],
    links: [
      { label: strings('validation.more.information'), href: 'https://github.com/open-cluster-management/rhacm-docs/blob/doc_stage/console/vwt_search.md#searching-with-visual-web-terminal' }
    ]
  }
}

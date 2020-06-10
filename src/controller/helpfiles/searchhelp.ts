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

import strings from '../../util/i18n'
import { NavResponse } from '@kui-shell/core'
import { getIntroduction, getTableContent } from './search-sidecar-help'


const contentType = 'text/html'
const sections = {
  introduction: {
    headers: [
      {
        header: strings('validation.about'),
        docs: strings('searchhelp.title'),
        key: strings('validation.about')
      },
      {
        header: strings('validation.usage'),
        docs: strings('searchhelp.header'),
        key: strings('validation.usage'),
        usage: `search [${strings('validation.definition.option')}][${strings('validation.definition.flag')}]`
      },
      {
        header: strings('validation.guide'),
        docs: strings('searchhelp.guide.docs', [`search <${'searchhelp.definition.command'}> -h`]),
        key: strings('validation.guide')
      }
    ]
  },
  commands: {
    headers: [
      {
        header: strings('validation.commands'),
        key: strings('validation.commands')
      },
      {
        header: strings('validation.docs'),
        key: strings('validation.definition.docs')
      }
    ],
    rows: [
      {
        command: 'search summary',
        name: 'summary',
        docs: strings('searchhelp.search.summary.docs'),
      },
      {
        command: 'search related:resources',
        name: 'related:resources',
        docs: strings('searchhelp.search.related.resources.docs'),
      },
    ]
  },
  flags: {
    headers: [
      {
        header: strings('validation.option'),
        key: strings('validation.option')
      },
      {
        header: strings('validation.docs'),
        key: strings('validation.definition.docs')
      }
    ],
    rows: [
      {
        command: 'search -i',
        name: '-i',
        docs: strings('searchhelp.search.install.docs'),
      },
      {
        command: 'search kind:pod --save',
        name: '--save',
        docs: strings('searchhelp.search.save.docs')
      },
      {
        command: 'search -delete="save"',
        name: '-delete="save"',
        docs: strings('delete.savedsearchhelp.title')
      },
      {
        command: 'search -delete="resource"',
        name: '-delete="resource"',
        docs: strings('delete.resourcehelp.title')
      },
    ]
  },
  aliases: {
    headers: [
      {
        header: strings('table.header.name'),
        key: strings('table.header.name')
      },
      {
        header: strings('table.header.short.name'),
        key: strings('table.header.short.name')
      }
    ]
  }
}

/**
 * Usage model for the search plugin
 *
 */
export function usage(): NavResponse {
  return {
    apiVersion: 'kui-shell/v1',
    kind: 'NavResponse',
    breadcrumbs: [{ label: 'search' }],
    menus: [
      {
        label: strings('validation.usage'),
        items: [
          {
            mode: strings('validation.introduction'),
            content: getIntroduction(sections.introduction.headers),
            contentType
          },
          {
            mode: strings('validation.option'),
            content: getTableContent(sections.flags),
            contentType
          },
        ]
      },
      {
        label: strings('validation.commands'),
        items: [
          {
            mode: `${strings('validation.basic')} (${strings('validation.beginner')})`,
            content: getTableContent(sections.commands),
            contentType
          }
        ]
      },
    ],
    links: [
      { label: strings('validation.more.information'), href: 'https://github.com/open-cluster-management/rhacm-docs/blob/doc_stage/console/vwt_search.md#searching-with-visual-web-terminal' }
    ]
  }
}

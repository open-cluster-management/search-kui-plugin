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
import { getIntroduction, getTableContent } from './search-sidecar-help'
import { getPluginState } from '../../pluginState'

const breadcrumb = (argv?: any) => {
  const flags = getPluginState().flags
  if (flags.includes(argv[argv.length - 1])) {
    argv.pop() // Remove help flag to prevent it from showing in the breadcrumb trail
  }

  const crumbs = argv.map((cmd) => ({
    label: cmd,
    command: `${cmd === 'search' ? ` ${cmd} -h` : undefined }`
  }))
  return crumbs
}

const contentType = 'text/html'
const apiVersion = 'kui-shell/v1'
const kind = 'NavResponse'

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
        command: 'search --related',
        name: '--related',
        docs: strings('searchhelp.search.related.resources.docs'),
      },
    ]
  },
  options: {
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
  summary: {
    headers: [
      {
        header: strings('validation.about'),
        docs: strings('searchhelp.title'),
        key: strings('validation.about')
      }
    ],
  }
}

/**
 * Usage model for the search plugin
 *
 */
export function usage(args?): NavResponse {
  return {
    apiVersion,
    kind,
    breadcrumbs: breadcrumb(args),
    menus: [
      {
        label: strings('validation.usage'),
        items: [
          {
            mode: strings('validation.introduction'),
            content: getIntroduction(sections.introduction.headers),
            contentType,
          },
          {
            mode: strings('validation.option'),
            content: getTableContent(sections.options),
            contentType,
          },
        ],
      },
      {
        label: strings('validation.commands'),
        items: [
          {
            mode: `${strings('validation.basic')} (${strings('validation.beginner')})`,
            content: getTableContent(sections.commands),
            contentType,
          },
        ],
      },
    ],
    links: [
      {
        label: strings('validation.more.information'),
        href: 'https://access.redhat.com/documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/2.3/html-single/web_console/index?lb_target=production#searching-with-visual-web-terminal',
      },
    ],
  }
}

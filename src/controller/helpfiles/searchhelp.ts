/*******************************************************************************
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
import { resources as resourceList } from '../../util/resource-list'


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
        docs: 'Use search <command> --help for more information about a given command.',
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
        name: `search <${strings('validation.definition.value')}>`,
        docs: strings('searchhelp.search.value.example'),
      },
      {
        name: `search <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>`,
        docs: strings('searchhelp.search.field.example'),
      },
      {
        name: `search <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}> --save`,
        docs: strings('searchhelp.search.save.example'),
      },
      {
        name: `search ${strings('validation.definition.summary')} <${strings('validation.definition.field')}>:<${strings('validation.definition.value')}>`,
        docs: strings('searchhelp.search.summary.example'),
      }
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
        command: 'search -delete="',
        name: '-delete="',
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
    ],
    rows: Object.entries(resourceList).map((resource) => { return {
      name: resource[0],
      docs: resource[1]
    }})
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
          {
            mode: strings('validation.resource.aliases'),
            content: getTableContent(sections.aliases),
            contentType
          }
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
      { label: 'More Information', href: 'https://github.com/open-cluster-management/search-kui-plugin' }
    ]
  }
}

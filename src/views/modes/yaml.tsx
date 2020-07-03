/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as jsYaml from 'js-yaml'
import { EditableSpec, getCurrentTab } from '@kui-shell/core'
import strings from '../../util/i18n'
import HTTPClient from '../../controller/HTTPClient'
import { UPDATE_RESOURCE } from '../../definitions/search-queries'

export function editSpec(cmd: string, resource?: any, data?: any): EditableSpec {
  return {
    readOnly: false,
    clearable: false,
    save: {
      label: strings('sidecar.yaml.edit.apply'),
      onSave: async (updated: string) => {
        HTTPClient('post', 'console', UPDATE_RESOURCE(jsYaml.load(updated), data))
        .then(() => {
          getCurrentTab().REPL.pexec(cmd)
        })
        .catch((err) => {
          console.debug(err)
        })

        return {
          // disable editor's auto toolbar update,
          // since this command will handle the toolbarText by itself
          noToolbarUpdate: true
        }
      }
    },
    revert: {
      label: strings('validation.revert'),
      onRevert: () => jsYaml.safeDump(resource)
    }
  }
}

/**
 * Render resources yaml tab
 *
 */
export const yamlTab = (resource: any, data?: any, cmd?: any) => {
  const spec = editSpec(cmd, resource, data.items[0])

  return {
    mode: 'yaml',
    label: 'YAML',
    order: 2,
    content: jsYaml.safeDump(resource),
    contentType: 'yaml',
    spec
  }
}

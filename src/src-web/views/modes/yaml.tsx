/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as jsYaml from 'js-yaml'
import { Badge } from '@kui-shell/core';
import * as lodash from 'lodash'

/**
 * Render resources yaml tab
 *
 */
export const yamlTab = (resource: any) => {
  const badges: Badge[] = []

  // This will allow the sidecar balloon element to display the resources name.
  const balloon = resource.metadata.name.split(/(-[0-9])/)
  badges.push(balloon[0])

  return{
    type: 'custom',
    // isEntity: true,
    content: jsYaml.safeDump(resource),
    contentType: 'yaml',
    kind: lodash.get(resource, 'kind', ''),
    name: lodash.get(resource, 'metadata.name', ''),
    packageName: lodash.get(resource, 'metadata.namespace', ''),
    badges,
    modes: [
      {
        defaultMode: true,
        mode: 'yaml',
        direct: () => yamlTab(resource),
        leaveBottomStripeAlone: true,
        label: 'YAML'
      },
    ]
  }
}
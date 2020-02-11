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
    mode: 'yaml',
    label: 'YAML',
    order: 2,
    content: jsYaml.safeDump(resource),
    contentType: 'yaml',
  }
}

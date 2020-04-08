/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as jsYaml from 'js-yaml'

/**
 * Render resources yaml tab
 *
 */
export const yamlTab = (resource: any) => {
  return{
    mode: 'yaml',
    label: 'YAML',
    order: 2,
    content: jsYaml.safeDump(resource),
    contentType: 'yaml',
  }
}

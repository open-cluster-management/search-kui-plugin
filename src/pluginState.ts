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

import strings from './util/i18n'

const state = {
  default: ['cluster', 'kind', 'label', 'name', 'namespace', 'status'],
  error: undefined,
  flags: ['-h', '-help', '--help'],
  searchSchema: [],
}

/**
 * Get plugin's state values
 */
const getPluginState = () => {
  return state
}

/**
 * Set plugin's state value
 * @param key
 * @param value
 */
const setPluginState = (key, value) => {
  state[key] = value
}

/**
 * Return node element if resources is not found
 */
export const resourceNotFound = (text?) => {
  const node = document.createElement('pre')
  node.setAttribute('class', 'oops')
  node.innerText = !text ? strings('search.no.resources.found') : text
  return node
}

export { getPluginState, setPluginState }

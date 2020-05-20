/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

const state = {
  enabled: true,
  searchSchema: [],
  default: ['cluster', 'kind', 'label', 'name', 'namespace', 'status'],
  error: undefined
}

const getPluginState = () => {
  return state
}

const setPluginState = (key, value) => {
  state[key] = value
}

export { getPluginState, setPluginState }


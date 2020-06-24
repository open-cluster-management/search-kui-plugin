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

export const convertStringToQuery = (searchText) => {
  let searchTokens = searchText.replace('search', '').trim(' ') // Remove search first

  if (searchTokens.includes('summary')) { // This will allow the alias for search to access the searchTokens for the command.
    searchTokens = searchTokens.replace('summary', '').split(' ')
  } else if (searchTokens.includes('--related')) {
    searchTokens = searchTokens.replace('--related', '').trim(' ').split(' ')
  } else {
    searchTokens = searchTokens.split(' ')
  }

  const keywords = searchTokens.filter((token) => token !== '' && token.indexOf(':') < 0)
  const filters = searchTokens.filter((token) => token.indexOf(':') >= 0)
    .map((f) => {
      let property
      let values
      // This will allow the search to return the clusterrolebinding resources
      if (f.includes('name:')) {
        [ property, values ] = ['name', f.replace('name:', '')]
      } else {
        [ property, values ] = f.split(':')
      }
      return { property, values: values.split(',') }
    })
    .filter((f) => ['', '=', '<', '>', '<=', '>=', '!=', '!'].findIndex((op) => op === f.values[0]) === -1)

  return { keywords, filters }
}

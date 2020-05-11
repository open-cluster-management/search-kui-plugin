/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const convertStringToQuery = (searchText) => {
  let searchTokens

  if (searchText.indexOf('search summary ') !== -1) { // This will allow the alias for search to access the searchTokens for the command.
    searchTokens = searchText.replace('search summary ', '').split(' ')
  } else if (searchText.indexOf('search related:resources ') !== -1) {
    searchTokens = searchText.replace('search related:resources ', '').split(' ')
  } else {
    searchTokens = searchText.replace('search ', '').split(' ')
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

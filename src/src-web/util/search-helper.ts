/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const convertStringToQuery = (searchText) => {
  if (searchText.indexOf('search summary ') !== -1){
    var tokens = searchText.replace('search summary ', '').split(' ')
    }
  else if(searchText.indexOf('search yaml ') !== -1){
    var tokens = searchText.replace('search yaml ', '').split(' ')
  }
  else if(searchText.indexOf('search related ') !== -1){
    var tokens = searchText.replace('search related ', '').split(' ')
  }
  else if(searchText.indexOf('search related:resources ') !== -1){
    var tokens = searchText.replace('search related:resources ', '').split(' ')
  }
  else{
    var tokens = searchText.replace('search ', '').split(' ')
  }

  const searchTokens = tokens
  const keywords = searchTokens.filter(token => token !== '' && token.indexOf(':') < 0)
  const filters = searchTokens.filter(token => token.indexOf(':') >= 0)
    .map(f => {
      // This will allow the search to return the clusterrolebinding resources
      if(f.includes("name:system:") || f.includes("name:icp:")){
        var [ property, values ] = f.split("name:")
        property = "name"
      }
      else
        var [ property, values ] = f.split(':')
      
      return { property, values: values.split(',') }
    })
    .filter(f => ['', '=', '<', '>', '<=', '>=', '!=', '!'].findIndex(op => op === f.values[0]) === -1)

  return {keywords, filters}
}
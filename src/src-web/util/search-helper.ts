/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/


export const convertStringToQuery = (searchText) => {
  // const searchTokens = searchText.split(' ')
  const searchTokens = searchText.replace('search ', '').split(' ')
  console.log('search Tokens: ', searchTokens)
  const keywords = searchTokens.filter(token => token !== '' && token.indexOf(':') < 0)
  const filters = searchTokens.filter(token => token.indexOf(':') >= 0)
    .map(f => {
      const [ property, values ] = f.split(':')
      return { property, values: values.split(',') }
    })
    .filter(f => ['', '=', '<', '>', '<=', '>=', '!=', '!'].findIndex(op => op === f.values[0]) === -1)
  return {keywords, filters}
}
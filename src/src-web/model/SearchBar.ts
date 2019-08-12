/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

export interface SearchBarProps {
    value: string
    availableFilters: Array<object>
    onChange: any
    onKeyPress: any
  }

export interface SearchBarState {
  suggestions: Array<string>
  currentQuery: string,
  currentTag: {
      field: string,
      matchText: Array<string>
  },
  searchComplete: string,
  tags: Array<object>,
  fieldOptions: Array<object>,
  chosenOperator: any,
  operators: Array<string>
}
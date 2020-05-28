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
    availableFilters: any[]
    onChange: any
    onKeyPress: any
  }

export interface SearchBarState {
  suggestions: string[]
  currentQuery: string,
  currentTag: {
      field: string,
      matchText: string[]
  },
  searchComplete: string,
  tags: object[],
  fieldOptions: object[],
  chosenOperator: any,
  operators: string[]
}

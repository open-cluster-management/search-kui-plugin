/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

export interface SearchInputProps {
    value: string
    onChange: any
    onKeyPress:any
  }

export interface SearchInputState {
  searchSchema: Array<object>
}
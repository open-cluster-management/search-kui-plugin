/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

export interface TableProps {
    items: object[],
    kind: string,
  }

export interface TableState {
  itemForAction: object,
  page: number,
  pageSize: number,
  sortDirection: any,
  selectedKey: string,
  modalOpen: boolean,
  collapse: boolean,
  action: string
}

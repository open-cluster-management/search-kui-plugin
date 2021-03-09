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

/**
 * NOTE: See documentation in SearchResourceTable.js
 */
import { getAge } from '../util/resource-helper'

export default {
  application: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  applicationrelationship: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'source' },
      { key: 'destination' },
      { key: 'type' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  cluster: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'nodes'},
      { key: 'klusterletVersion'},
      { key: 'kubernetesVersion', msgKey: 'k8sVersion' },
      { key: 'cpu'},
      { key: 'storage'},
      { key: 'memory'},
    ],
    actions: [],
  },
  configmap: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'created', transform: getAge },
    ],
  },
  cronjob: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'schedule' },
      { key: 'suspend' },
      { key: 'active' },
      { key: 'lastSchedule', transform: getAge },
      { key: 'created', transform: getAge },
    ],
  },
  daemonset: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'desired' },
      { key: 'current' },
      { key: 'ready' },
      { key: 'updated' },
      { key: 'available' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  deployable: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'chartUrl' },
      { key: 'dependencies' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  deployment: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'desired' },
      { key: 'current' },
      { key: 'ready' },
      { key: 'available' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  genericresource: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'created', transform: getAge },
    ],
  },
  job: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'completions' },
      { key: 'parallelism' },
      { key: 'successful' },
      { key: 'created', transform: getAge },
    ],
  },
  namespace: {
    columns: [
      { key: 'name' },
      { key: 'cluster' },
      { key: 'status' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  node: {
    columns: [
      { key: 'name' },
      { key: 'cluster' },
      { key: 'role' },
      { key: 'architecture' },
      { key: 'osImage' },
      { key: 'cpu' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  persistentvolume: {
    columns: [
      { key: 'name' },
      { key: 'cluster'},
      { key: 'type'},
      { key: 'status'},
      { key: 'capacity'},
      { key: 'accessModes', msgKey: 'accessMode' },
      { key: 'claimRef', msgKey: 'claim' },
      { key: 'reclaimPolicy'},
      { key: 'path'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  persistentvolumeclaim: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'status'},
      { key: 'persistentVolume', msgKey: 'persistent.volume'},
      { key: 'requests'},
      { key: 'accessModes', msgKey: 'accessMode'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  placementbinding: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'subjects' },
      { key: 'placementpolicy' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  placementpolicy: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'replicas' },
      { key: 'decisions' },
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  pod: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'status'},
      { key: 'restarts' },
      { key: 'hostIP'},
      { key: 'podIP'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  policy: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'remediationAction'},
      { key: 'created', transform: getAge },
    ],
  },
  release: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'status'},
      { key: 'chartName'},
      { key: 'chartVersion'},
      { key: 'updated', transform: getAge },
    ],
    actions: [],
  },
  replicaset: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'desired'},
      { key: 'current'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  savedSearches: {
    columns: [
      { key: 'name' },
      { key: 'description' },
      { key: 'searchText' },
      { key: 'count' },
    ],
    actions: [],
  },
  secret: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster' },
      { key: 'type' },
      { key: 'created', transform: getAge },
    ],
  },
  service: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
  statefulset: {
    columns: [
      { key: 'name' },
      { key: 'namespace' },
      { key: 'cluster'},
      { key: 'desired'},
      { key: 'current'},
      { key: 'created', transform: getAge },
    ],
    actions: [],
  },
}

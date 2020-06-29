'use strict';
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

const data = {
  count: 2,
  items: [
    {
      cluster: 'mock-cluster-1',
      container: 'mock-pod',
      created: '2019-09-17T18:17:13Z',
      hostIP: 'mock-node-1',
      image: 'hyc-cloud-private-edge-docker-local.artifactory.swg-devops.com/ibmcom-amd64/mock-pod:latest',
      kind: 'pod',
      label: 'app=mock-pod; chart=mock-release--99.99.99; pod-template-hash=1; release=mock-release-',
      name: 'mock-pod-1',
      namespace: 'kube-system',
      podIP: 'mock-node-1',
      restarts: 0,
      selfLink: '/api/v1/namespaces/kube-system/pods/mock-pod-1',
      startedAt: '2019-09-17T18:17:13Z',
      status: 'Running'
    },
    {
      cluster: 'mock-cluster-2',
      container: 'mock-pod',
      created: '2019-09-17T18:17:19Z',
      hostIP: 'mock-node-2',
      image: 'hyc-cloud-private-edge-docker-local.artifactory.swg-devops.com/ibmcom-amd64/mock-pod:latest',
      kind: 'pod',
      label: 'app=mock-pod; chart=mock-release--99.99.99; pod-template-hash=1; release=mock-release-',
      name: 'mock-pod-2',
      namespace: 'kube-system',
      podIP: 'mock-node-2',
      restarts: 0,
      selfLink: '/api/v1/namespaces/kube-system/pods/mock-pod-2',
      startedAt: '2019-09-17T18:17:19Z',
      status: 'Running'
    }
  ],
  kind: 'pod',
  related: [
    {
      count: 2,
      items: [
        {
          cluster: 'mock-cluster-1',
          created: '2019-09-17T17:49:01Z',
          kind: 'secret',
          name: 'mock-secret-1',
          namespace: 'kube-system',
          selfLink: '/api/v1/namespaces/kube-system/secrets/mock-secret-1'
        },
        {
          cluster: 'mock-cluster-2',
          created: '2019-09-17T17:49:02Z',
          kind: 'secret',
          name: 'mock-secret-2',
          namespace: 'kube-system',
          selfLink: '/api/v1/namespaces/kube-system/secrets/mock-secret-2'
        }
      ],
      kind: 'secret'
    },
    {
      count: 2,
      items: [
        {
          architecture: 'amd64',
          cluster: 'mock-cluster-1',
          cpu: 8,
          created: '2019-09-17T17:48:58Z',
          kind: 'node',
          label: 'beta.kubernetes.io/arch=amd64; beta.kubernetes.io/os=linux; etcd=true; kubernetes.io/hostname=mock-node-1; management=true; master=true; node-role.kubernetes.io/etcd=true; node-role.kubernetes.io/management=true; node-role.kubernetes.io/master=true; node-role.kubernetes.io/proxy=true; node-role.kubernetes.io/va=true; proxy=true; role=master; va=true',
          name: 'mock-node-1',
          osImage: 'Ubuntu 18.04.3 LTS',
          role: 'etcd, management, master, proxy, va',
          selfLink: '/api/v1/nodes/mock-node-1'
        },
        {
          architecture: 'amd64',
          cluster: 'mock-cluster-2',
          cpu: 8,
          created: '2019-09-17T17:48:59Z',
          kind: 'node',
          label: 'beta.kubernetes.io/arch=amd64; beta.kubernetes.io/os=linux; etcd=true; kubernetes.io/hostname=mock-node-2; management=true; master=true; node-role.kubernetes.io/etcd=true; node-role.kubernetes.io/management=true; node-role.kubernetes.io/master=true; node-role.kubernetes.io/proxy=true; node-role.kubernetes.io/va=true; proxy=true; role=master; va=true',
          name: 'mock-node-2',
          osImage: 'Ubuntu 18.04.3 LTS',
          role: 'etcd, management, master, proxy, va',
          selfLink: '/api/v1/nodes/mock-node-2'
        }
      ],
      kind: 'node'
    },
    {
      count: 2,
      items: [
        {
          chartName: 'mock-release-1',
          chartVersion: '99.99.99',
          cluster: 'mock-cluster-1',
          kind: 'release',
          name: 'mock-release-1',
          namespace: 'kube-system',
          revision: 1,
          status: 'DEPLOYED',
          updated: '2019-09-17T18:17:12Z'
        },
        {
            chartName: 'mock-release-2',
            chartVersion: '99.99.99',
            cluster: 'mock-cluster-2',
            kind: 'release',
            name: 'mock-release-2',
            namespace: 'kube-system',
            revision: 1,
            status: 'DEPLOYED',
            updated: '2019-09-17T18:17:13Z'
          }
      ],
      kind: 'release'
    },
    {
      count: 2,
      items: [
        {
          kind: 'cluster',
          name: 'mock-cluster-1'
        },
        {
          kind: 'cluster',
          name: 'mock-cluster=2'
        }
      ],
      kind: 'cluster'
    },
    {
      count: 2,
       items: [
        {
          cluster: 'mock-cluster-1',
          clusterIP: 'None',
          created: '2019-09-17T18:17:12Z',
          kind: 'service',
          label: 'app=mock-service; chart=mock-release--99.99.99; heritage=Tiller; release=mock-release-1',
          name: 'mock-memcached-1',
          namespace: 'kube-system',
          port: '11211/TCP',
          selfLink: '/api/v1/namespaces/kube-system/services/mock-memcached-1',
          type: 'ClusterIP'
        },
        {
          cluster: 'mock-cluster-2',
          clusterIP: 'None',
          created: '2019-09-17T18:17:13Z',
          kind: 'service',
          label: 'app=mock-service; chart=mock-release--99.99.99; heritage=Tiller; release=mock-release-1',
          name: 'mock-memcached-2',
          namespace: 'kube-system',
          port: '11211/TCP',
          selfLink: '/api/v1/namespaces/kube-system/services/mock-memcached-2',
          type: 'ClusterIP'
        }
      ],
      kind: 'service'
    },
    {
      count: 2,
      items: [
        {
          apigroup: 'apps',
          available: 1,
          cluster: 'mock-cluster-1',
          created: '2019-09-17T18:17:12Z',
          current: 1,
          desired: 1,
          kind: 'deployment',
          label: 'app=mock-deployment-1; chart=mock-release--99.99.99; heritage=Tiller; release=mock-release-1',
          name: 'mock-deployment-1',
          namespace: 'kube-system',
          ready: 1,
          selfLink: '/apis/extensions/v1beta1/namespaces/kube-system/deployments/mock-deployment-1'
        },
        {
          apigroup: 'apps',
          available: 1,
          cluster: 'mock-cluster-2',
          created: '2019-09-17T18:17:13Z',
          current: 1,
          desired: 1,
          kind: 'deployment',
          label: 'app=mock-deployment-2; chart=mock-release--99.99.99; heritage=Tiller; release=mock-release-2',
          name: 'mock-deployment-2',
          namespace: 'kube-system',
          ready: 1,
          selfLink: '/apis/extensions/v1beta1/namespaces/kube-system/deployments/mock-deployment-2'
        }
      ],
      kind: 'deployment'
    },
    {
      count: 2,
      items: [
        {
          apigroup: 'apps',
          cluster: 'mock-cluster-1',
          created: '2019-09-17T18:17:13Z',
          current: 1,
          desired: 1,
          kind: 'replicaset',
          label: 'app=mock-replicaset; chart=mock-release--99.99.99; pod-template-hash=1; release=mock-release-1',
          name: 'mock-replicaset-1',
          namespace: 'kube-system',
          selfLink: '/apis/extensions/v1beta1/namespaces/kube-system/replicasets/mock-replicaset-1'
        },
        {
          apigroup: 'apps',
          cluster: 'mock-cluster-2',
          created: '2019-09-17T18:17:13Z',
          current: 1,
          desired: 1,
          kind: 'replicaset',
          label: 'app=mock-replicaset; chart=mock-release--99.99.99; pod-template-hash=1; release=mock-release-2',
          name: 'mock-replicaset-2',
          namespace: 'kube-system',
            selfLink: '/apis/extensions/v1beta1/namespaces/kube-system/replicasets/mock-replicaset-2'
        }
      ],
      kind: 'replicaset'
    }
  ]
}

exports.data = data

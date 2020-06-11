/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

import * as React from 'react'
import * as lodash from 'lodash'
import { CheckmarkFilled16, ErrorFilled16, WarningFilled16, Unknown16 } from '@carbon/icons-react'

export const status = [
  {
    type: 'success',
    icon: <CheckmarkFilled16 className={`status-success`}/>,
    values: [
      'Running',
      'DEPLOYED',
      'Active',
      'OK',
      'Available',
      'Ready',
    ],
  },
  {
    type: 'warning',
    icon: <WarningFilled16 className={`status-warning`}/>,
    values: [
      'Pending',
      'Terminating',
      'ContainerCreating',
    ],
  },
  {
    type: 'failed',
    icon: <ErrorFilled16 className={`status-failed`}/>,
    values: [
      'Failed',
      'CrashLoopBackOff',
      'ImagePullBackOff',
      'ErrImagePull',
      'Error',
      'OOMKilled',
      'Init:OOMKilled',
    ],
  },
  {
    type: 'completed',
    icon: <CheckmarkFilled16 className={`status-completed`}/>,
    values: [
      'Completed',
      'Succeeded',
    ],
  },
  {
    type: 'unknown',
    icon: <Unknown16 className={'status-unknown'}/>,
    values: [
      'Unknown',
    ],
  },
]

export const getStatusIcon = (data) => {
  const _ = status.filter((stat) => stat.values.includes(data))
  return lodash.get(_, '[0].icon', '')
}

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

'use strict'
import React from 'react'
import { TagState, TagProps } from '../model/Tag'

class Tag extends React.Component<TagProps, TagState> {
  // customized tag, used by tag input
  getClassType(tag) {
    const { classNames } = this.props
    switch (tag.classType) {
      case 'keyword':
        return 'react-tags__keyword-tag'
      default:
        return classNames.selectedTag
    }
  }

  render() {
    const { classNames, onDelete, tag } = this.props
    return (
      <button type="button" className={this.getClassType(tag)} onClick={onDelete}>
        <span className={classNames.selectedTagName}>{tag.name}</span>
      </button>
    )
  }
}

export default Tag

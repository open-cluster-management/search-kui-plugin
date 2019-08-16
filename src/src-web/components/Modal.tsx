/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
Object.defineProperty(window, 'navigator', { value: { userAgent: 'node' }, writable: true })
Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })

import * as React from 'react'
import * as PropTypes from 'prop-types'
import repl = require('@kui-shell/core/core/repl')

import { Modal } from 'carbon-components-react'
import { ModalProps, ModalState } from '../model/Modal'

import strings from '../util/i18n'

export default class ResourceTable extends React.PureComponent<ModalProps, ModalState> {
  static propTypes = {
    item: PropTypes.object,
    modalOpen: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      errors: null,
    }
  }

  handleDelete() {
    const { item } = this.props
    switch (item['kind']) {
      case 'savedSearches':
        // Backend doesn't handle error case when deleting a saved query
        repl.pexec(`deleteSavedSearch ${item['name']}`)
        this.props.onClose()
        break
      default:
        repl.pexec(`deleteResource ${item['name']} ${item['namespace']} ${item['kind']} ${item['cluster']} ${item['selfLink']}`)
        this.props.onClose()
    }
  }

  render() {
    const { item, modalOpen } = this.props
    const bodyLabel = item['kind']
    const heading = strings('modal.remove.heading', [item['kind']])
    return (
      <Modal
        danger
        id='remove-resource-modal'
        open={modalOpen}
        primaryButtonText={strings('modal.remove-kuberesource.heading')}
        secondaryButtonText={strings('modal.button.cancel')}
        modalLabel={bodyLabel}
        modalHeading={heading}
        onRequestClose={() => this.props.onClose()}
        onRequestSubmit={() => this.handleDelete()}
        role='region'
        aria-label={heading}
      >
          <p>{strings('modal.remove.confirm', [item['name']])}</p>
      </Modal>
    )
  }
}

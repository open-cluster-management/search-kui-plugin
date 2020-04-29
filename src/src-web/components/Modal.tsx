/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

// Hack to workaround build issues with Carbon dependencies
if (!window || !window.navigator || !window.navigator.userAgent) {
  Object.defineProperty(window, 'navigator', { value: { userAgent: 'node'}, writable: true })
  Object.defineProperty(document, 'getElementById', { value: (val: string) => document.querySelector('#' + val), writable: true })
}

import * as React from 'react'
import * as PropTypes from 'prop-types'
import { getCurrentTab, inBrowser } from '@kui-shell/core'
import { Modal, TextInput, TextArea, Tooltip } from 'carbon-components-react'
import { Copy16 } from  '@carbon/icons-react'
import { ModalProps, ModalState } from '../model/Modal'
import strings from '../util/i18n'
import HTTPClient from '../controller/HTTPClient'
import { SAVE_SEARCH, SEARCH_RELATED_QUERY, SAVED_SEARCH_QUERY } from '../definitions/search-queries'
import { convertStringToQuery } from '../util/search-helper'

export default class ResourceModal extends React.PureComponent<ModalProps, ModalState> {
  static propTypes = {
    item: PropTypes.object,
    modalOpen: PropTypes.bool,
  }

  originalInput = false

  constructor(props) {
    super(props)
    this.state = {
      description: '',
      name: '',
      errors: null,
      open: true, // This open state will be used to open and close the modal for saving search queries.
    }
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleDelete() {
    const { item } = this.props
    switch (item['kind']) {
      case 'savedSearches':
        // Backend doesn't handle error case when deleting a saved query
        getCurrentTab().REPL.pexec(`deleteSavedSearch ${item['name']}`)
        this.props.onClose()
        break
      default:
        getCurrentTab().REPL.pexec(`deleteResource ${item['name']} ${item['namespace']} ${item['kind']} ${item['cluster']} ${item['selfLink']}`)
        this.props.onClose()
    }
  }

  handleEdit() {
    const { item } = this.props

    const data = {
      name: this.state.name,
      description: this.state.description,
      searchText: item['searchText'],
      id: item['id'],
    }

    if (!this.state.errors) {
      HTTPClient('post', 'search', SAVE_SEARCH(data))
      .then((res) => {
        getCurrentTab().REPL.pexec(`savedsearches`)
        this.props.onClose()
      })
      .catch((err) => {
        this.setState({ errors: err })
      })
    }
  }

  handleSave() {
    const id = Date.now().toString()

    const data = {
      name: this.state.name,
      description: this.state.description,
      searchText: this.props.item['command'].replace(/search|--save/g, '').trim(),
      id,
    }

    const userQuery = convertStringToQuery(data.searchText)

    HTTPClient('post', 'search', SEARCH_RELATED_QUERY(userQuery.keywords, userQuery.filters)) // Check to see if the query is vaild
    .then((res) => {
      if (res.data.searchResult[0].items) {
        HTTPClient('post', 'search', SAVE_SEARCH(data))
        .then((resp) => {
          this.setState({ open: false })
          getCurrentTab().REPL.pexec('savedsearches')
        })
        .catch((err) => {
          this.setState({ errors: err })
        })
      }
    })
    .catch((err) => {
      this.setState({ errors: err })
    })
  }

  componentDidUpdate() {
    if (!this.props.modalOpen) { // If the modal is closed, clear old data values
      this.setState({name: '', description: '', errors: undefined})
      this.originalInput = false
    }

    if (this.props.action === 'edit' && this.props.modalOpen && !this.originalInput) { // When the modal opens, it should display the saved query data in the input's sections
      HTTPClient('post', 'search',  SAVED_SEARCH_QUERY)
      .then((res) => {
        const data = res.data.items.filter((item) => item.name === this.props.item['name'])

        if (data.length === 0) { // Saved search is no longer available.
          this.setState({ errors: strings('modal.edit.deleted.search') })
        }
      })

      this.setState({name: this.props.item['name'], description: this.props.item['description']})
      this.originalInput = true
    }
  }

  handleNameChange(event) {
    this.setState({name: event.target.value})
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value})
  }

  render() {
    const { item, modalOpen } = this.props
    const bodyLabel = item['kind']
    let heading = ''

    switch (this.props.action) {
      case 'edit':
        heading = strings('modal.query.save.heading')
        break
      case 'save':
        heading = strings('modal.save.title')
        break
      case 'share':
        heading = strings('modal.query.share.heading')
        break
      case 'remove':
        heading = strings('modal.query.delete.heading')
        break
      default:
        break
    }

    return (
      <Modal
        className={this.props.action === 'share' ? 'bx--modal-share' : undefined}
        danger={this.props.action === 'remove'}
        id='remove-resource-modal'
        open={this.props.action !== 'save' ? modalOpen : this.state.open}
        primaryButtonText={this.props.action === 'remove' ? strings('modal.remove-kuberesource.heading') : strings('actions.save')}
        primaryButtonDisabled={(this.props.action === 'edit' && this.state.name === '')
        || (this.props.action === 'edit' && this.state.name === this.props.item['name'] && this.state.description === this.props.item['description'])
        || (this.props.action === 'save' && this.state.name === '')}
        secondaryButtonText={strings('modal.button.cancel')}
        modalLabel={bodyLabel ? bodyLabel.toUpperCase() : undefined}
        modalHeading={heading}
        onRequestClose={() => this.props.action !== 'save' ? this.props.onClose() : this.setState({ open: false })}
        onRequestSubmit={() => this.props.action === 'remove' ? this.handleDelete() : this.props.action === 'edit' ? this.handleEdit() : this.handleSave()}
        role='region'
        aria-label={heading}>
        {this.props.action === 'edit' || this.props.action === 'save'
          ? <div className='bx--action-edit'>
              {this.props.action === 'save' ? <p className='save-text'>{strings('modal.save.text')}</p> : null}
              {this.state.errors ? <p className='oops save-text-error'>{strings(this.state.errors)}</p> : null }
              <TextInput
                className={'bx--action-name'}
                disabled={false}
                id={'name'}
                labelText={strings('modal.query.add.name.label')}
                maxLength={50}
                type='text'
                value={this.state.name}
                onChange={this.handleNameChange}
                placeholder={strings('modal.query.add.name')}
              />
              <TextArea
                className={'bx--action-description'}
                disabled={false}
                id={'description'}
                labelText={strings('modal.query.add.desc.label')}
                maxLength={140}
                type='text'
                value={this.state.description}
                onChange={this.handleDescriptionChange}
                placeholder={strings('modal.query.add.desc')}
              />
            </div>
          : null
        }
        {this.props.action === 'share'
          ? <div className='bx--action-share'>
              <p className='copy-description'>{strings('modal.query.share.name.label')}</p>
              <div className='bx--snippet bx--snippet--single'>
                {inBrowser()
                  ? `${window && window.location && window.location.origin}/multicloud/search?filters={"textsearch":"${encodeURIComponent(this.props.item['searchText'])}"}`
                  : `search ${this.props.item['searchText']}`
                }
                <Tooltip
                  direction='top'
                  tabIndex={0}
                  tooltipBodyId='tooltip-body'
                  renderIcon={Copy16}
                  showIcon
                  onChange={() => navigator.clipboard.writeText(inBrowser()
                    ? `${window && window.location && window.location.origin}/multicloud/search?filters={"textsearch":"${encodeURIComponent(this.props.item['searchText'])}"}`
                    : `search ${this.props.item['searchText']}`,
                  )}
                >
                  <p id='tooltip-body'>
                    {strings('modal.button.copied.to.clipboard')}
                  </p>
                </Tooltip>
              </div>
            </div>
          : null
        }
        {this.props.action === 'remove'
          ? <p>{strings('modal.remove.confirm', [item['name']])}</p>
          : null
        }
      </Modal>
    )
  }
}

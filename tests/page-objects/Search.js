/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-expressions */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const chalk = require('chalk')
const { outputSelector, successSelector, resultInputSelector, failureSelector } = require('../config/selectors')

module.exports = {
    url: function () {
      return this.api.launchUrl
    },
    elements: {
      commandInput: '.kui--input-stripe',
      inputBar: '.kui--input-stripe input',
      suggestions: '.react-tags__suggestions',
      ReactTagsLiOne: '#ReactTags-listbox-1',
      searchHelpOutput: '.usage-error-wrapper'
    },
    commands: [{
      waitForPageLoad,
      verifyWebsocketConnection,
      searchHelp,
      searchSuggestions,
      // searchKeyword
    }]
  }

  function waitForPageLoad(browser) {
    this.api.pause(5000)
      // The acceptInsecuretCerts config for Firefox doesn't work, so we have to click and accept
      this.api.element('css selector', '#errorPageContainer', res => {
        if (res.status !== -1) {
          this.waitForElementPresent('#advancedButton').press('#advancedButton')
          this.waitForElementPresent('#exceptionDialogButton').click('#exceptionDialogButton')
          this.waitForElementNotPresent('#errorPageContainer')
        }
        browser.element('css selector', '.page', res => {
          this.waitForElementNotPresent('@pageLoading', 60000)
          this.waitForElementPresent('@page', 20000)
          this.waitForElementPresent('@main')
          this.waitForElementPresent('@tabStripe')
        })
      })
  }

  function verifyWebsocketConnection(browser) {
    this.waitForElementPresent(successSelector, 60000)
    browser.assert.isCommand("ready")
  }

  function searchHelp(browser){
    const {ENTER} = browser.Keys
    this.waitForElementPresent('@commandInput', 5000)
    this.waitForElementPresent('@inputBar', 5000)

    this.setValue('@inputBar', 'clear') // clean output
    browser.keys(ENTER)
    this.api.pause(500) // lag on enter press

    this.setValue('@inputBar', 'search -h')
    browser.keys(ENTER)
    this.api.pause(500) // lag on enter press

    this.expect.element('@inputBar').to.be.present
    this.expect.element('@searchHelpOutput').to.be.present
  }

  function searchSuggestions(browser){
    const { SPACE, ENTER } = browser.Keys
    this.waitForElementPresent('@commandInput')
    this.waitForElementPresent('@inputBar')

    this.setValue('@inputBar', 'clear') // clean output
    browser.keys(ENTER)
    this.api.pause(500) // lag on enter press

    this.setValue('@inputBar', 'search')
    browser.keys(SPACE)
    this.api.pause(500) // lag on enter press

    this.expect.element('@suggestions').to.be.present
    this.expect.element('@ReactTagsLiOne').to.be.present
  }

  // function searchKeyword(browser){
  //   const {ENTER} = browser.Keys
  //   this.waitForElementPresent('@commandInput')
  //   this.waitForElementPresent('@inputBar')

  //   this.setValue('@inputBar', 'clear') // clean output
  //   browser.keys(ENTER)
  //   this.api.pause(500) // lag on enter press

  //   this.setValue('@inputBar', 'search platform')
  //   browser.keys(ENTER)
  //   this.api.pause(500) // lag on enter press

  //   this.waitForElementPresent(resultInputSelector, 10000)
  //   browser.assert.value(resultInputSelector, command)
  // }


/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/


module.exports = {
    '@disabled': false,
    before: function (browser) {
      const loginPage = browser.page.LoginPage()
      const Search = browser.page.Search()
      if (!process.env.TEST_LOCAL) {
        loginPage.navigate()
        loginPage.authenticate()
      }
      Search.navigate()
      Search.waitForPageLoad(browser),
      Search.verifyWebsocketConnection(browser)
    },

    'Verify search help': browser => {
      const Search = browser.page.Search()
      Search.searchHelp(browser)
    },

    'Verify search and suggestions': browser => {
      const Search = browser.page.Search()
      Search.searchSuggestions(browser)
    },

    // 'Verify search keyword': browser => {
    //   const Search = browser.page.Search()
    //   Search.searchKeyword(browser)

    //   CLI.verifyTableOutput(browser)
    // },

    after: function (browser, done) {
    setTimeout(() => {
        if (browser.sessionId) {
        browser.end()
        done()
        } else {
        done()
        }
    })
    }
  }
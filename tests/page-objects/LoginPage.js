/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

module.exports = {
  url: function () {
    return `${this.api.launchUrl}`
  },
  elements: {
    header: '.app-header'
  },
   /* eslint-disable @typescript-eslint/no-use-before-define */
  commands: [{
    inputUsername,
    inputPassword,
    submit,
    authenticate,
    waitForLoginSuccess,
    waitForLoginPageLoad
  }]
}

function authenticate(user, password) {
  let loginPage = 'html.login-pf'
  let specialSelect = '.login a.idp'
  let useUser = process.env.USE_USER || 'ocp'
  let userNameField = '#inputUsername'
  let passwordField = '#inputPassword'
  let submitBtn = 'button[type="submit"]'
  this.api.element('css selector', loginPage, res => {
    if (res.value !== 0) { // OCP
      console.log('Logging into OCP')
    } else { // ICP
      console.log('Logging into ICP')
      loginPage = '.login-container'
      userNameField = '#username'
      passwordField = '#password'
      submitBtn = 'button[name="loginButton"]'
    }
    const execLogin = () => {
      this.waitForElementPresent(userNameField)
      this.inputUsername(user, userNameField)
      this.inputPassword(password, passwordField)
      this.submit(submitBtn)
      this.waitForLoginSuccess(loginPage)
    }
    this.waitForLoginPageLoad(loginPage)
    this.api.elements('css selector', specialSelect, res => {
      if (res.status < 0 || res.value.length < 1) {
        console.log('Normal login')
        execLogin();
      }else{
        const  userSelector = `.login a.idp[title="Log in with ${useUser}"]`
        console.log('Selecting User',useUser,'use selector: ',userSelector)
        this.press(userSelector)
        execLogin()
      }
    })

  })
}

function inputUsername(user, userNameField) {
  this.waitForElementPresent(userNameField)
    .setValue(userNameField, user || process.env.K8S_CLUSTER_USER)
}

function inputPassword(password, passwordField) {
  this.waitForElementPresent(passwordField)
    .setValue(passwordField, password || process.env.K8S_CLUSTER_PASSWORD)
}

function submit(submitBtn) {
  this.waitForElementPresent(submitBtn)
    .press(submitBtn)
}

function waitForLoginSuccess() {
  this.waitForElementPresent('@header', 20000)
}

function waitForLoginPageLoad(loginPage) {
  this.waitForElementPresent(loginPage, 20000)
}

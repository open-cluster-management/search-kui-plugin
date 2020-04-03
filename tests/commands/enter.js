/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * 
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

'use strict'

const util = require('util')
const events = require('events')

function enter () {
  events.EventEmitter.call(this)
}
console.log('enter')
util.inherits(enter, events.EventEmitter)

enter.prototype.command = function () {
  this.client.api.execute(function () {
    const enter = new KeyboardEvent('keypress', { bubbles: true, cancelable: true, keyCode: 13 });
    let element;
    if (!document.querySelector('.kui--input-stripe .react-tags')){
      element = document.querySelector('.kui--input-stripe input')
    } else {
      element = document.querySelector('.kui--input-stripe .react-tags__search-input input');
    }
    const command = element.value
    if (window && window.navigator.userAgent.includes('Mozilla')) {
      element.value = command;
      element.dispatchEvent(enter);
    }
    element.value = command;
    element.dispatchEvent(enter);
  }, [], () => this.emit('complete'))

  return this
}

module.exports = enter

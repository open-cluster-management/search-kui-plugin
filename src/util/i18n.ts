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

export default (key: string, args?: Array<any>) => {
  const defaultStrings: Record<string, string> = require(`../../i18n/en-US.json`)
  const locale = process.env.LOCALE || (typeof navigator !== 'undefined' && navigator.language)

  const i18n = (locale: string): Record<string, string> => {
      try {
      return (locale && require(`../../i18n/${locale}.json`)) || defaultStrings
      } catch (err) {
      try {
          return (
          (locale && require(`../../i18n/${locale.replace(/-.*$/, '')}.json`)) || defaultStrings
          )
      } catch (err) {
          console.error('Could not find translation for given locale', locale)
          return defaultStrings
      }
      }
  }

  // Start with the default strings then replace with the locale strings. So if a
  // string isn't defined for a specific locale, we use the default (English) string.
  const _strings = {...defaultStrings, ...i18n(locale)}
  let string = _strings[key]
  if (string && args) {
      args.forEach((arg, idx) => {
      string = string.replace(`{${idx}}`, arg)
      })
  }
  return string || defaultStrings[key] || key
  }
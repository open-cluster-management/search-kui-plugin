
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

export default (key: string, args?: Array<any>) => {
    const defaultStrings: Record<string, string> = require(`../../i18n/locales/en-US.json`)
  
    const locale = process.env.LOCALE || (typeof navigator !== 'undefined' && navigator.language)

    const i18n = (locale: string): Record<string, string> => {
      try {
        return (locale && require(`../../i18n/locales/${locale}.json`)) || defaultStrings
      } catch (err) {
        try {
          return (
            (locale && require(`../../i18n/locales/${locale.replace(/-.*$/, '')}.json`)) || defaultStrings
          )
        } catch (err) {
          console.error('Could not find translation for given locale', locale)
          return defaultStrings
        }
      }
    }
  
    const _strings = i18n(locale)
    let string = _strings[key]
    if (args) {
      args.forEach((arg, idx) => {
        string = string.replace(`{${idx}}`, arg)
      })
    }
    return string || defaultStrings[key] || key
  }

/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

interface StylesheetDirect {	
  css: string	
  key: string	
}	
interface StylesheetFile {	
  path: string	
  key: string	
}	
function isAStylesheetDirect(object: StylesheetSpec): object is StylesheetDirect {	
  return typeof object !== 'string' && 'css' in object && 'key' in object	
}	
function isAStylesheetFile(object: StylesheetSpec): object is StylesheetFile {	
  return typeof object !== 'string' && 'path' in object && 'key' in object	
}

type StylesheetSpec = StylesheetDirect | StylesheetFile | string

declare const mediaUri: string

const injectCSS = (file: StylesheetSpec): void => {	

  const contentType = 'text/css'	
  const rel = 'stylesheet'	

  const id = isAStylesheetDirect(file) || isAStylesheetFile(file) ? `injected-css-${file.key}` : `injected-css-${file}`	

  if (!document.getElementById(id)) {	
    // this will be either a <style> or a <link>	
    // depending on whether we have the raw text	
    // or an href	
    let link	

    if (isAStylesheetDirect(file)) {	
      // then we have the content, not a filename	
      // debug('injecting stylesheet from given content')	
      link = document.createElement('style')	
      link.appendChild(document.createTextNode(file.css))	
    } else {	
      // debug('injecting stylesheet from file ref')	
      link = document.createElement('link')	
      link.rel = rel	
      const muri = typeof mediaUri !== 'undefined' ? mediaUri + '/' : ''	
      if (isAStylesheetFile(file)) {	
        link.href = `${muri}${file.path}`	
      } else {	
        link.href = `${muri}${file}`	
      }	
    }	

    link.id = id	
    link.type = contentType	
    document.getElementsByTagName('head')[0].appendChild(link)	
  }	
}

export const injectOurCSS = (env?) => {
  try {
    if (env === 'test') { // TODO: Find a way to import/require css file for jest testing.
      return {
        css: '../styles/index.css',
        key: 'search'
      }
    } else {
      injectCSS({
        css: require('../styles/index.css'),
        key: 'search'
      })
    }
  } catch (err) {
    return err
  }
}
/*
 * Copyright 2018 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** how many options to show at a time, i.e. before scrolling */
const nRowsInViewport = 4

/** list of related commands */
const all = [
  'summary',
  'saved'
]
const allExcept = cmd => all.filter(_ => _ !== cmd)

/* the breadcrumb chain */
const parents = ['search']

const header = {
  summary: 'Display kubernetes resource summary detail',
  saved: 'Show saved searches of kuberentes resources',
  related: 'Show related resources connected to the kubernetes resource'
}

 /**
 * Usage model for the search plugin
 *
 */
export const toplevel = {
    breadcrumb: 'search',
    command: 'search',
    title: 'Search for kubernetes resources',
    header: 'These commands will help you search for your kubernetes resources',
    example: 'search <resource>\nsearch <kind> <resource>\nsearch summary <kind> <resource>\nsearch saved\n',
    nRowsInViewport: 4,
    available: [
      { 
        command: 'summary',
        docs: header.summary,
        dir: true,
        commandPrefix: 'search'
      },
      { 
        command: 'saved',
        docs: header.saved,
        dir: true,
        commandPrefix: 'search'
      },
      { 
        command: 'related',
        docs: header.related,
        dir: true,
        commandPrefix: 'search'
      }
    ],
    related: ['summary', 'saved', 'related']
  }
  
  // SUMMARY OPERATIONS
  export const summary = {
    title: 'Summarize kubernetes resource',
    header: `${header.summary}`,
    example: 'search summary <kind> <resource>',
    commandPrefix: 'search summary',
    parents,
    related: allExcept('search summary')
  }
  
  // SAVED OPERATIONS
  export const saved = {
    title: 'Saved searches of kubernetes resources',
    header: `${header.saved}.`,
    example: 'search saved',
    commandPrefix: 'search saved',
    //command: 'search saved'
    parents,
    related: allExcept('search saved')
  }

  export const related = {
    title: 'Saved searches of kubernetes resources',
    header: `${header.related}.`,
    example: 'search related',
    commandPrefix: 'search related',
    //command: 'search saved'
    parents,
    related: allExcept('search related')
  }
  
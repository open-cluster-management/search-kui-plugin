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

import { CommandRegistrar } from '@kui-shell/core/models/command'
import actions from './src-web/controller/actionHandler'
import savedSearch from './src-web/controller/savedSearch'
import search from './src-web/controller/search'
import summary from './src-web/controller/sidecar'
import related from './src-web/views/modes/related'
import yaml from './src-web/views/modes/yaml'

export default async (commandTree: CommandRegistrar) => {
  return Promise.all([
    actions(commandTree),
    search(commandTree),
    savedSearch(commandTree),
    summary(commandTree),
    related(commandTree),
    yaml(commandTree)
  ])
}
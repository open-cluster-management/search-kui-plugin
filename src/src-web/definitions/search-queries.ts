/*
 * Copyright 2019 IBM Corporation
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

// SEARCH_SCHEMA

export const GET_SEARCH_SCHEMA = {
    operationName:"searchSchema",
    variables:{},
    query: "query searchSchema {\n  searchSchema\n  }"
  }
  
  
  // GET_SEARCH_COMPLETE
  
  export const GET_SEARCH_COMPLETE = (property, query) => {
    return {
      operationName:"searchComplete",
      variables:{
        property: property,
        query: query
      },
      query: "query searchComplete($property: String!, $query: SearchInput) {\n  searchComplete(property: $property, query: $query)\n }"
    }
  }
  
  
  //SEARCH_QUERY
  
  export const SEARCH_QUERY = (keywords, filters) => {
    return {
        operationName:"searchResult",
        variables:{
          input:[{"keywords":keywords,"filters":filters}]
        },
        query: "query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    __typename\n  }\n}\n"
      }
   };
/*******************************************************************************
* Licensed Materials - Property of IBM
* (c) Copyright IBM Corporation 2019. All Rights Reserved.
*
* Note to U.S. Government Users Restricted Rights:
* Use, duplication or disclosure restricted by GSA ADP Schedule
* Contract with IBM Corp.
*******************************************************************************/

export const GET_SEARCH_SCHEMA = {
  operationName: 'searchSchema',
  variables: {},
  query: 'query searchSchema {\n  searchSchema\n  }',
}

export const GET_SEARCH_COMPLETE = (property, query) => {
  return {
    operationName: 'searchComplete',
    variables: {
      property,
      query,
    },
    query: 'query searchComplete($property: String!, $query: SearchInput) {\n  searchComplete(property: $property, query: $query)\n }',
  }
}

export const SEARCH_RELATED_QUERY = (keywords, filters) => {
  return {
    operationName: 'searchResult',
    variables: {
     input: [{ keywords, filters }],
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    count\n    items\n    related {\n      kind\n      count\n      items\n      __typename\n    }\n    __typename\n  }\n}\n',
  }
}

export const SEARCH_QUERY = (keywords, filters) => {
  return {
    operationName: 'searchResult',
    variables: {
      input: [{ keywords, filters }],
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    items\n    __typename\n  }\n}\n',
  }
};

export const SEARCH_QUERY_COUNT = (input) => {
  return {
    operationName: 'searchResult',
    variables: {
      input,
    },
    query: 'query searchResult($input: [SearchInput]) {\n  searchResult: search(input: $input) {\n    count\n    __typename\n  }\n}\n',
  }
}

export const SEARCH_MCM_QUERY = (record) => {
  return {
    operationName: 'getResource',
    variables: {
        kind: record[0].kind,
        name: record[0].name,
        namespace: record[0].namespace,
        cluster: record[0].cluster,
        selfLink: record[0].selfLink,
      },
    query: 'query getResource($kind: String, $name: String, $namespace: String, $cluster: String, $selfLink: String) {\n  getResource(kind: $kind, name: $name, namespace: $namespace, cluster: $cluster, selfLink: $selfLink)\n}\n',
  }
}

export const SAVED_SEARCH_QUERY = {
  operationName: 'userQueries',
  variables: {},
  query: 'query userQueries {\n items: userQueries {\n name\n description\n searchText\n __typename\n}\n}\n',
}

export const DELETE_QUERY = (name) => {
  return {
    operationName: 'deleteQuery',
    query: 'mutation deleteQuery($resource: JSON!) {\n deleteQuery(resource: $resource)\n}\n',
    variables: {
      resource: {
        name,
      },
    },
  }
}

export const DELETE_RESOURCE = (name, namespace, kind, cluster, selfLink) => {
  return {
    perationName: 'deleteResource',
      query: 'mutation deleteResource($selfLink: String, $name: String, $namespace: String, $cluster: String, $kind: String, $childResources: JSON) {\ndeleteResource(selfLink: $selfLink, name: $name, namespace: $namespace, cluster: $cluster, kind: $kind, childResources: $childResources)\n}\n',
      variables: {
        // TODO - Not sure if child resources are handled at all..
        // childResources,
        name,
        namespace,
        kind,
        cluster,
        selfLink,
      },
  }
}

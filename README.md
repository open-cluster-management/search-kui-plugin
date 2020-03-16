# search-kui-plugin
[![Build Status](https://travis-ci.com/open-cluster-management/search-kui-plugin.svg?token=jzyyzQmWYBEu33MCMh9p&branch=master)](https://travis-ci.com/open-cluster-management/search-kui-plugin)

Adds Search capabilities to [KUI Web Terminal](https://github.com/open-container-management/kui-web-terminal).

## Development
Clone the [KUI repository](https://github.com/IBM/kui) and follow developer set-up directions from that repo.

To activate this plugin, copy this repository into the `plugins/` directory in the top-level of the [KUI repository](https://github.com/IBM/kui).  It's a KUI requirement that individual plugin directories be named with the `plugin-` prefix (in this case:  `plugin-search`).

<pre>
.
├── ...
├── package.json
├── plugins
│   ├── plugin-sample
│   └── plugin-search
|       ├── ...
|       └── tsconfig.json
├── tsconfig-es6.json
└── tsconfig.json
</pre>

1. To use the plugin within the dev environment, add then `plugin-search` path to the `dependencies` list in the `package.json` at the root level.

##### package.json

```
 "dependencies": {
    "@kui-shell/plugin-sample": "file:plugins/plugin-sample",
    "@kui-shell/plugin-search": "file:plugins/plugin-search",
```

2. Add plugin's reference path to the root level `tsconfig.json` & `tsconfig-es6.json` file.

##### tsconfig.json
```
  "references": [
    { "path": "./plugins/plugin-sample" },
    { "path": "./plugins/plugin-search" }
  ]
```

##### tsconfig-es6.json
```
  "references": [
    { "path": "./plugins/plugin-sample/tsconfig-es6.json" },
    { "path": "./plugins/plugin-search/tsconfig-es6.json" }
  ]
```

3. The following variables need to be set in the `src/lib/shared/config.ts` file.

<pre>
SEARCH_API - Endpoint of the search API
ACM_API - Endpoint of the ACM API
SEARCH_SERVICE - Search service URL. (The value retrieved from this endpoint, is to ensure that the Search API is installed on the cluster)
</pre>

To get an access token login to your env using: `oc login --token=<cluster API Token> --server=https://<cluster URL>:6443`. The login command can be found by accessing the OCP console. After logging into the OCP console, click the top right dropdown menu and select `Copy Login Command`. The user will be redirected to display the token. Copy the command, and execute the command within the CLI. Then run `oc whoami --show-token` and copy the access token.

<pre>
authorization & cookie - User access token
</pre>

4. Install the plugin dependencies

```
npm install
```

5. Compile the code at the root-level of the KUI repo.

```
npm run compile
```

6. Execute start at the root-level of the KUI repo.  The desktop/electron instance of KUI should launch. (Update this later for steps for ACM KUI testing).

```
npm run start
```

Try `search` commands. Ex: `search kind:pod`

<br>
<a href="docs/readme/images/search-command.gif">
    <img alt="" src="docs/readme/images/search-command.gif"></img>
</a>

## Testing

The following will run all jest based unit tests. (Jest configurations can be specified within the `package.json` file or the `jest.config.js` file.)

```
npm run test:unit
```

## NPM Commands

| Command                | Description                                                         |
|------------------------|---------------------------------------------------------------------|
| `npm run test:unit`    | Run jest tests                                                      |
| `npm run commit`       | CLI tool that helps format commit messages with a series of prompts |
| `npm run buildCSS`     | Compile SCSS into readable CSS                                      |
| `npm run scss`         | Watches SCSS style changes and updates the current CSS files        |

## Trigger a release
To trigger a new release you must push a commit of type `fix` or `release`
```
npm run commit
```

## Links

These are a few useful links that will help provide technical reference and best practices when developing for the platform.

- [Carbon Component React](https://github.com/carbon-design-system/carbon-components-react)
- [NPM Docs](https://docs.npmjs.com)
- [React Docs](https://reactjs.org/docs/hello-world.html)
- [Jest Unit Testing](https://jestjs.io/docs/en/getting-started)
- [Nightwatch E2E Testing](https://nightwatchjs.org/guide)

# search-kui-plugin
[![Build Status](https://travis-ci.com/open-cluster-management/search-kui-plugin.svg?token=jzyyzQmWYBEu33MCMh9p&branch=master)](https://travis-ci.com/open-cluster-management/search-kui-plugin)

Adds Search capabilities to [KUI Web Terminal](https://github.com/open-container-management/kui-web-terminal).

## Development
Clone the [KUI repository](https://github.com/IBM/kui) and follow developer set-up directions from that repo.

Set SEARCH_API and accessToken in src/lib/shared/config.ts. To get an access token login to your env using: `cloudctl login -a https://<cluster URL>:8443`. Then run `cloudctl tokens` and copy the access token, everything after `Bearer`.

To activate this plugin, copy this repository into the `plugins/` directory in the top-level of the [KUI repository](https://github.com/IBM/kui).  It's a KUI requirement that individual plugin directories be named with the `plugin-` prefix (in this case:  `plugin-search`).

Execute `npm install`

Execute `npm run compile` at the root-level of the KUI repo.

Execute `npm run start` at the root-level of the KUI repo.  The desktop/electron instance of KUI should launch. (Update this later for steps for MCM KUI testing).

Try `search` commands. Ex: `search kind:pod`

<br>
<a href="docs/readme/images/search-command.gif">
    <img alt="" src="docs/readme/images/search-command.gif"></img>
</a>

## Testing

The following will run all jest based unit tests. (Jest configurations can be specified within the `package.json` file or the `jest.config.js` file.)

`npm run test:unit`

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

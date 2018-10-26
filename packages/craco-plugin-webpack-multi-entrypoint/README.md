# Craco Plugin: Multiple Webpack Entrypoints
This plugin allows the configuration of multiple entrypoints with craco and create-react-app.  With multiple entrypoints, you can configure specific "chunking" of your application as well as multiple generated output HTML files.


## Usage
Within your `craco.config.js` file, use as follows:

```javascript
const path = require("path");
const hotReloader = require.resolve('react-dev-utils/webpackHotDevClient');
const entrypointPlugin = require("@craco/craco-plugin-webpack-multi-entrypoint");
const { whenDev } = require("@craco/craco");

// Define custom entrypoints
const entrypoints = {
    myEntry: [
        path.resolve(process.cwd(), 'src/myEntry.js')
    ]
};

// Optional: Add hot reloader when in development
whenDev(() => entrypoints.map(ep => ep.unshift(hotReloader));

module.exports = {
...
    devServer: whenDev(() => ({
        // When in development, tell the dev server to rewrite URLs according to new entrypoints
        historyApiFallback: {
            rewrites: entrypointPlugin.devServerRewrites(entrypoints)
        }
    })),
    plugins: [
        // Add entrypoint plugin with custom entrypoints as options
        { plugin: entrypointPlugin, options: { entrypoints } }
    ]
...
};

```

/* craco-plugin-webpack-multi-entrypoint.js */

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { whenDev } = require("@craco/craco");

const appEntryKey = "app";

const addEntrypoints = (webpackConfig, entrypoints) => {
    webpackConfig.entry = {
        // Reassign original entry to named 'app' configuration
        [appEntryKey]: webpackConfig.entry
    };

    Object.keys(entrypoints).forEach(entryKey => {
        webpackConfig.entry[entryKey] = entrypoints[entryKey];
    });

    return webpackConfig;
};

const chunkOutput = webpackConfig => {
    const output = path.parse(webpackConfig.output.filename);
    webpackConfig.output.filename = `${output.dir}/[name].${output.name}${output.ext}`;
};

const addHtmlOutputs = (webpackConfig, entrypoints, outputs, paths) => {
    // Reassign original html to named 'app' chunck
    webpackConfig.plugins = webpackConfig.plugins.map(plugin => {
        if (plugin.constructor.name === "HtmlWebpackPlugin" && plugin.options.filename === "index.html") {
            plugin.options.chunks = [appEntryKey];
        }

        return plugin;
    });

    // Push new html to plugins with assigned chunk
    Object.keys(entrypoints).forEach(entryKey => {
        const template = outputs && outputs[entryKey] ? outputs[entryKey].template : paths.appHtml;
        const filename = outputs && outputs[entryKey] ? outputs[entryKey].filename : `${entryKey}.html`;
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                inject: true,
                chunks: [entryKey],
                template,
                filename
            })
        );
    });

    return webpackConfig;
};

module.exports = {
    overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
        const { entrypoints, outputs } = pluginOptions;

        webpackConfig = addEntrypoints(webpackConfig, entrypoints);
        webpackConfig = addHtmlOutputs(webpackConfig, entrypoints, outputs, paths);
        whenDev(() => chunkOutput(webpackConfig));

        fs.writeFileSync("c:\\temp\\webpackConfig.json", JSON.stringify(webpackConfig));

        return webpackConfig;
    },
    devServerRewrites: entrypoints => {
        const devServerRewrites = Object.keys(entrypoints).map(entryKey => {
            return { from: new RegExp(`^/${entryKey}.html`), to: `/build/${entryKey}.html` };
        });

        fs.writeFileSync("c:\\temp\\devServerRewrites.json", JSON.stringify(devServerRewrites));

        return devServerRewrites;
    }
};

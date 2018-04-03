const webpack = require('webpack');
const path = require('path');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const utils = require('./utils.js');

module.exports = (WATCH) => ({
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            app: utils.root('src/main/webapp/app/')
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                use: [
                    { loader: 'cache-loader' },
                    { loader: 'ts-loader' },
                    {
                        loader: 'angular2-template-loader',
                        options: {
                            keepUrl: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader',
                exclude: /\.async\.(html|css)$/
            },
            {
                test: /\.async\.(html|css)$/,
                loaders: ['file?name=[name].[hash].[ext]', 'extract']
            },
            {
                test: /\.scss$/,
                loaders: ['to-string-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /src[/|\\]main[/|\\]webapp[/|\\].+\.ts$/,
                enforce: 'post',
                exclude: /node_modules/,
                loader: 'sourcemap-istanbul-instrumenter-loader?force-sourcemap=true'
            }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                SERVER_API_URL: `''`
            }
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)($|\?)/i // process .js and .ts files only
        }),
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            utils.root('./src') // location of your src
        ),
        new LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: !WATCH,
                    failOnHint: false
                }
            }
        })
    ],
    mode: 'development'
});

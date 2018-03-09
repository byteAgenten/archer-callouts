var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');

var path = require('path');


module.exports = {

    entry: {
        'archer.callouts': ['./src/archer-callouts.ts']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: "var",
        library: "ArcherCallouts"
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {configFileName: path.resolve(__dirname, 'src/tsconfig.json')},
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                include: __dirname + '/src',
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "raw-loader",
                    loader: "raw-loader!sass-loader?sourceMap"
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', 'html', 'scss', 'css']
    },
    plugins: [

        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }]),
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: false
        })

    ]
};

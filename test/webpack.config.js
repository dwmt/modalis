'use strict'

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const nodeExternals = require('webpack-node-externals')

const webpackConfig = {
	devtool: 'inline-cheap-module-source-map',
	mode: 'development',
	resolve: {
		extensions: [ '.js', '.vue' ],
		alias: {
			'vue$': 'vue/dist/vue.runtime.js'
		}
	},
	output: {
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					{ loader: 'css-loader', options: { sourceMap: true } },
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin()
	]
}

module.exports = webpackConfig

# Webpack Logger Plugin

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![dependencies Status](https://david-dm.org/michaelgilley/webpack-logger-plugin/status.svg)](https://david-dm.org/michaelgilley/webpack-logger-plugin)

What you get:

<img src="imgs/building.png" width="400px" /> <img src="imgs/complete.png" width="400px" />

With readable error output:

<img src="imgs/error.png" width="400px" />

## Introduction

When using Webpack the default output during compilation is generally not all that
helpful. This plugin draws from a few other plugins out there to give you progress
output and a clean terminal.

**Why not use [nyan-progress-webpack-plugin](https://github.com/alexkuz/nyan-progress-webpack-plugin)?**
For a simple reason, this plugin aims to simplify terminal output and progress bars
with webpack are not all that helpful since the total number of modules being bundled
is not known on startup, meaning your progress bar keeps adjusting down as build
continues. Instead, we use a spinner along with [react-dev-utils](https://www.npmjs.com/package/react-dev-utils)' helpful message
formatting.

**TL;DR**

This package is for Webpack users who have large projects created *before* they
could benefit from [create-react-app](https://github.com/facebookincubator/create-react-app/).

## Install

```
$ npm i -D webpack-logger-plugin
```

## Usage

Add to your webpack config:

```js
const WebpackLoggerPlugin = require('webpack-logger-plugin')

const config = {
	entry: '...',
	output: {...},
	modules: {...},
	plugins: [
		new WebpackLoggerPlugin()
	]
}
```

And add this to your webpack-dev-server config:

```js
const server = new webpackDevServer(compiler, {
	quiet: true,
	// If using proxy add logLevel: 'silent'
	proxy: {
		'/api': {
			...
			logLevel: 'silent'
		}
	}
})
```

const path = require("path")

module.exports = {
	mode: "development",
	entry: {
		app: "./src/App/index.js",
		link: "./src/Link/index.js",
	},
	output: {
		filename: "bundle.[name].js",
		path: path.resolve(__dirname, "dist"),
	},
	externals: {
		a2a: "a2a",
	},
	resolve: {
		fallback: {
			url: require.resolve("url"),
			zlib: require.resolve("browserify-zlib"),
			assert: require.resolve("assert"),
			stream: require.resolve("stream-browserify"),
			buffer: require.resolve("buffer"),
		},
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
				options: {
					sources: false,
					esModule: false,
				},
			},
		],
	},
}

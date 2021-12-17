const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

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
			{
				test: /\.(less)$/,
				use: [
					MiniCssExtractPlugin.loader, // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								strictMath: false,
							},
						},
					}, // compiles Less to CSS
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader, // creates style nodes from JS strings
					{ loader: "css-loader" },
				],
			},
		],
	},
	plugins: [new MiniCssExtractPlugin()],
}

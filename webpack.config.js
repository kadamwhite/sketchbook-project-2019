const { join } = require( 'path' );
const TerserPlugin = require( 'terser-webpack-plugin' );

module.exports = {
	mode: 'production',
	// devtool: false,
	devtool: 'cheap-module-eval-source-map',
	optimization: {
		minimizer: [ new TerserPlugin( {
			terserOptions: {
				// mangle: false,
				output: {
					// beautify: true,
					// semicolons: false,
				},
			},
		} ) ],
	},
	entry: {
		'lines': './a-bunch-of-lines',
		'blobs': './blobs',
		'nested-blocks': './paste-into-console',
		'connected-nodes': './paste-into-console-graph-version',
		'triangles': './paste-into-console-tri-version',
		'arbitrary-triangles': './arbitrary-triangles',
		'voronoi': './voronoi',
	},
	output: {
		filename: '[name].js',
		path: join( process.cwd(), 'build' ),
	},
};

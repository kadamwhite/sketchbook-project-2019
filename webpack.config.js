const { join } = require( 'path' );

module.exports = {
	mode: 'production',
	devtool: false,
	entry: {
		'nested-blocks': './paste-into-console',
		'connected-nodes': './paste-into-console-graph-version',
		'triangles': './paste-into-console-tri-version',
	},
	output: {
		filename: '[name].js',
		path: join( process.cwd(), 'build' ),
	},
};

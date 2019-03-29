const {
	appendStyle,
	nodesToCenterpoints,
	updateProgressIndicator,
} = require( './nodes' );
const {
	distance,
	findNearestPoints,
	Triangle,
} = require( './geo' );
const svg = require( './svg' );

// const pointsToLine = ( p1, p2 ) => svg.line( new Line( p1.x, p1.y, p2.x, p2.y ) );

const nextFrame = () => new Promise( resolve => setTimeout( resolve, 0 ) );

// const ascending = ( accessor = val => val ) => ( a, b ) => accessor( a ) - accessor( b );

const randomIdx = arr => Math.floor( Math.random() * arr.length );
const removeFromCollection = ( items, collection ) => {
	if ( ! Array.isArray( items ) ) {
		return removeFromCollection( [ items ], collection );
	}
	items.forEach( item => {
		const idx = collection.indexOf( item );
		collection.splice( idx, 1 );
	} );
};

const convert = async container => {
	appendStyle( 'html, body { height: auto !important; }' );

	const boundingBox = container.getBoundingClientRect();

	const maxDiagonal = distance( 0, 0, boundingBox.width, boundingBox.height );
	// const minLineLength = 0.05 * maxDiagonal;
	// const maxLineLength = 0.15 * maxDiagonal;
	let minLineLength = Math.min(
		0.05 * maxDiagonal,
		0.1 * boundingBox.width
	);
	let maxLineLength = Math.min(
		0.10 * maxDiagonal,
		0.25 * boundingBox.width
	);
	if ( maxLineLength < minLineLength ) {
		// See https://medium.com/@frontman/how-swap-two-values-without-temporary-variables-using-javascript-8bb28f96b5f6
		maxLineLength = minLineLength + ( minLineLength = maxLineLength, 0 );
	}

	let points = nodesToCenterpoints( container );
	const ptCount = points.length;

	let pt = points.splice( randomIdx( points ), 1 )[ 0 ];
	const triangles = [];
	while ( points.length >= 2 ) {
		const pts = findNearestPoints( pt, points, 2 );
		pts.forEach( pt => {
			pt.count = pt.count ? pt.count + 1 : 1;
		} );
		// removeFromCollection( pts, points );
		triangles.push( new Triangle( pt.x, pt.y, pts[0].x, pts[0].y, pts[1].x, pts[1].y ) );
		points = points.filter( pt => {
			if ( pt.count > 2 ) {
				return false;
			}
			for ( let tri of triangles ) {
				if ( tri.contains( pt ) ) {
					return false;
				}
			}
			return true;
		} );
		pt = pts[ randomIdx( pts ) ];
		removeFromCollection( pt, points );
		// pt = points.splice( randomIdx( points ), 1 )[ 0 ];
		await nextFrame();
		updateProgressIndicator( ( ptCount - points.length ) / ptCount );
	}

	triangles.forEach( tri => svg.add( svg.triangle( tri ) ) );

	return svg.render( boundingBox );
};

global.convert = convert;

console.time( 'svg created in' );
global.convert( document.body )
	.then( svg => {
		console.timeEnd( 'svg created in' );
		console.log( 'run `copy( svg )` to pull SVG content into clipboard.' );
		window.svg = svg;
		if ( global.copy ) {
			global.copy( svg );
		}
	} )
	.catch( err => console.error( err ) );

const {
	nodesToCenterpoints,
	updateProgressIndicator,
} = require( './nodes' );
const svg = require( './svg' );
const {
	Line,
	toPoint,
} = require( './geo' );
let { convert } = ( () => {
	function sum( collection, prop ) {
		return collection.reduce( ( sum, item ) => sum + item[prop], 0 );
	}

	function testEq( a, b ) {
		if ( a !== b ) {
			throw new Error( `Expected ${ a } to equal ${ b }` );
		}
	}

	testEq( 8, sum( [ { a: 1 }, { a: 4 }, { a: 3 } ], 'a' ) );

	const distance = ( pt1, pt2 ) => Math.sqrt(
		( Math.abs( pt1.x - pt2.x ) ** 2 ) + ( Math.abs( pt1.y - pt2.y ) ** 2 )
	);

	const randomSampleArray = ( arr, count ) => {
		if ( count >= arr.length ) {
			return arr;
		}
		const clonedArr = [ ...arr ];
		const randomElements = [];
		while ( randomElements.length < count ) {
			const idx = Math.floor( Math.random() * clonedArr.length );
			randomElements.push( clonedArr.splice( idx, 1 )[ 0 ] );
		}
		return randomElements;
	}

	const pointsToLine = ( p1, p2 ) => svg.line( new Line( p1.x, p1.y, p2.x, p2.y ) );
	const pointToCircle = point => svg.circle( point );

	const nextFrame = () => new Promise( resolve => setTimeout( resolve, 0 ) );

	const nodeToSVG = async container => {
		const boundingBox = container.getBoundingClientRect();

		const maxDiagonal = distance( toPoint( 0, 0 ), toPoint( boundingBox.width, boundingBox.height ) );
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

		const points = nodesToCenterpoints( container );

		const increment = 1 / points.length;
		let progress = 0;

		const svgElements = [];
		let currentIdx = 0;
		for ( let point of points ) {
			svg.add( pointToCircle( point ) );

			let batchSize = 100;
			const remainingPoints = points
				.slice( currentIdx + 1 )
				// No vertical or horizontal lines
				.filter( ( { x, y } ) => {
					if ( x === point.x || y === point.y ) {
						return false;
					}
					return true;
				} )
				// No more than three lines to any one point
				.filter( point2 => point2.count <= 3 )
				.filter( point2 => {
					const dist = distance( point, point2 );
					return dist > minLineLength && dist < maxLineLength;
				} );

			for ( let point2 of randomSampleArray( remainingPoints, 1 ) ) {
			// for ( let point2 of randomSampleArray( remainingPoints, 4 ) ) {
				point2.count = point2.count ? point2.count + 1 : 1;
				svg.add( pointsToLine( point, point2 ) );
				batchSize -= 1;
				if ( batchSize < 0 ) {
					batchSize = 100;
					await nextFrame();
				}
			}

			currentIdx += 1;
			progress = progress + increment;
			updateProgressIndicator( progress );
		}

		return svg.render( boundingBox );
	};

	return { convert: nodeToSVG };
} )();

console.time( 'svg created in' );
convert( document.body )
	.then(
		svg => {
			console.timeEnd( 'svg created in' );
			console.log( 'run `copy( svg )` to pull SVG content into clipboard.' );
			window.svg = svg;
		},
		err => console.error( err )
	);

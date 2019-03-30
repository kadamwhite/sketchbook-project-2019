const {
	Line,
	Triangle,
} = require( './geo' );
const svg = require( './svg' );

const WIDTH = 500;
const HEIGHT = 700;

const range = 100;
const nextPoint = prevPoint => ( {
	x: Math.round( prevPoint.x + ( Math.random() * range ) - ( range / 2 ) ),
	y: Math.round( prevPoint.y + ( Math.random() * range ) - ( range / 2 ) ),
} );
const randomPoint = ( min, max ) => Math.floor( Math.random() * (
	Math.round( max ) - Math.round( min )
) );

// const pointsToLine = ( p1, p2 ) => svg.line( new Line( p1.x, p1.y, p2.x, p2.y ) );
const nextFrame = () => new Promise( resolve => setTimeout( resolve, 0 ) );

const tri = () => {
	const p1 = {
		x: randomPoint( range, WIDTH - range ),
		y: randomPoint( range, HEIGHT - range ),
	};
	const p2 = nextPoint( p1 );
	const p3 = nextPoint( p1 );
	return new Triangle( p1.x, p1.y, p2.x, p2.y, p3.x, p3.y );
};

const intersects = ( newTri, tris ) => {
	for ( let tri of tris ) {
		if ( newTri.intersects( tri ) ) {
			return true;
		}
	}
	return false;
};

( async () => {
	const tris = [];
	while ( tris.length < 50 ) {
		const newTri = tri();
		if ( newTri.area() >= 40 && ! intersects( newTri, tris ) ) {
			tris.push( newTri );
			svg.add( svg.triangle( newTri ) );
		}
		document.body.innerHTML = svg.render( {
			width: WIDTH,
			height: HEIGHT,
		} );
		await nextFrame();
	}
	const lines = [];
	for ( let tri of tris ) {
		const proximateTriangles = tris
			.sort( ( a, b ) => tri.distance( a ) - tri.distance( b ) )
			.filter( tri => tri.count ? tri.count < 2 : true );
		[
			tri.closestPoints( proximateTriangles[ 2 ] ).points,
			tri.closestPoints( proximateTriangles[ 3 ] ).points,
		]
			.map( points => new Line( ...points ) )
			.filter( ( line, i ) => {
				for ( let tri of tris ) {
					if ( line.intersects( tri ) ) {
						return false;
					}
				}
				for ( let otherLine of lines ) {
					if ( line.intersects( otherLine ) ) {
						return false;
					}
				}
				proximateTriangles[ i + 2 ].count = proximateTriangles[ i + 2 ].count ?
					proximateTriangles[ i + 2 ].count + 1 :
					1;
				lines.push( line );
				return true;
			} )
			.forEach( line => svg.add( svg.line( line, 'stroke-dasharray="3"' ) ) );

		document.body.innerHTML = svg.render( {
			width: WIDTH,
			height: HEIGHT,
		} );
		await nextFrame();
	}
} )();

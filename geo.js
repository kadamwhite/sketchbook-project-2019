const equalPoint = ( x1, y1, x2, y2 ) => ( x1 === x2 && y1 === y2 );

const sum = nums => nums.reduce( ( sum, num ) => sum + num, 0 );

// See https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
const linesIntersect = ( x1, y1, x2, y2, x3, y3, x4, y4 ) => {
	if (
		equalPoint( x1, y1, x3, y3 ) ||
		equalPoint( x1, y1, x4, y4 ) ||
		equalPoint( x2, y2, x3, y3 ) ||
		equalPoint( x2, y2, x4, y4 )
	) {
		return false;
	}
	let a_dx = x2 - x1;
	let a_dy = y2 - y1;
	let b_dx = x4 - x3;
	let b_dy = y4 - y3;
	let s = ( -a_dy * ( x1 - x3 ) + a_dx * ( y1 - y3 ) ) / ( -b_dx * a_dy + a_dx * b_dy );
	let t = ( +b_dx * ( y1 - y3 ) - b_dy * ( x1 - x3 ) ) / ( -b_dx * a_dy + a_dx * b_dy );
	return ( s >= 0 && s <= 1 && t >= 0 && t <= 1 );
}

const distance = ( x1, y1, x2, y2 ) => Math.sqrt(
	( Math.abs( x1 - x2 ) ** 2 ) + ( Math.abs( y1 - y2 ) ** 2 )
);

const sortPoints = points => points.sort( ( a, b ) => a.x * a.y - b.x * b.y );

class Line {
	constructor( p1x, p1y, p2x, p2y ) {
		const [ start, end ] = sortPoints( [
			{
				x: p1x,
				y: p1y,
			},
			{
				x: p2x,
				y: p2y,
			},
		] );

		this.start = start;
		this.p1x = start.x;
		this.p1y = start.y;
		this.end = end;
		this.p2x = end.x;
		this.p2y = end.y;
		this.points = [ this.p1x, this.p1y, this.p2x, this.p2y ];
	}

	length() {
		return distance( this.p1x, this.p1y, this.p2x, this.p2y );
	}

	intersects( shape ) {
		if ( shape instanceof Line ) {
			return linesIntersect( this.p1x, this.p1y, this.p2x, this.p2y, ...shape.points );
		} else if ( shape instanceof Triangle ) {
			for ( let line of shape.lines() ) {
				if ( this.intersects( line ) ) {
					return true;
				}
			}
			return false;
		}
	}
}

const pIsInTriangle = ( px, py, ax, ay, bx, by, cx, cy ) => {

	//credit: http://www.blackpawn.com/texts/pointinpoly/default.html

	const v0 = [ cx - ax, cy - ay ];
	const v1 = [ bx - ax, by - ay ];
	const v2 = [ px - ax, py - ay ];

	const dot00 = ( v0[0] * v0[0] ) + ( v0[1] * v0[1] );
	const dot01 = ( v0[0] * v1[0] ) + ( v0[1] * v1[1] );
	const dot02 = ( v0[0] * v2[0] ) + ( v0[1] * v2[1] );
	const dot11 = ( v1[0] * v1[0] ) + ( v1[1] * v1[1] );
	const dot12 = ( v1[0] * v2[0] ) + ( v1[1] * v2[1] );

	const invDenom = 1 / ( dot00 * dot11 - dot01 * dot01 );

	const u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
	const v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

	return ( ( u >= 0 ) && ( v >= 0 ) && ( u + v < 1 ) );
}

const isPoint = val => {
	if ( ! val || typeof val === 'number' ) {
		return false;
	}
	return val.x !== undefined && val.y !== undefined;
};

class Circle {
	constructor( cx, cy, r = 2 ) {
		this.cx = cx;
		this.cy = cy;
		this.r = r;
	}
}

class Triangle {
	constructor( p1x, p1y, p2x, p2y, p3x, p3y ) {
		const [ p1, p2, p3 ] = sortPoints( [
			{
				x: p1x,
				y: p1y,
			},
			{
				x: p2x,
				y: p2y,
			},
			{
				x: p3x,
				y: p3y,
			},
		] );
		this.p1x = p1.x;
		this.p1y = p1.y;
		this.p2x = p2.x;
		this.p2y = p2.y;
		this.p3x = p3.x;
		this.p3y = p3.y;
		this.points = [ p1.x, p1.y, p2.x, p2.y, p3.x, p3.y ];
		this.l1 = new Line( p1.x, p1.y, p2.x, p2.y );
		this.l2 = new Line( p2.x, p2.y, p3.x, p3.y );
		this.l3 = new Line( p3.x, p3.y, p1.x, p1.y );
	}

	contains( x, y ) {
		return pIsInTriangle(
			isPoint( x ) ? x.x : x,
			isPoint( y ) ? x.y : y,
			...this.points
		);
	}

	distance( tri ) {
		return [
			[ this.p1x, this.p1y, tri.p1x, tri.p1y ],
			[ this.p1x, this.p1y, tri.p2x, tri.p2y ],
			[ this.p1x, this.p1y, tri.p3x, tri.p3y ],
			[ this.p2x, this.p2y, tri.p1x, tri.p1y ],
			[ this.p2x, this.p2y, tri.p2x, tri.p2y ],
			[ this.p2x, this.p2y, tri.p3x, tri.p3y ],
			[ this.p3x, this.p3y, tri.p1x, tri.p1y ],
			[ this.p3x, this.p3y, tri.p2x, tri.p2y ],
			[ this.p3x, this.p3y, tri.p3x, tri.p3y ],
		].reduce(
			( minimum, points ) => Math.min( minimum, distance( ...points ) ),
			Infinity
		);
	}

	area() {
		const sides = this.lines().map( l => l.length() );
		const s = sum( sides ) / 2;
		return Math.sqrt( s * ( s - sides[0] ) * ( s - sides[1] ) * ( s - sides[2] ) );
	}

	lines() {
		return [ this.l1, this.l2, this.l3 ];
	}

	intersects( shape ) {
		if ( shape instanceof Line ) {
			return shape.intersects( this );
		} else if ( shape instanceof Triangle ) {
			for ( let line of shape.lines() ) {
				if ( this.intersects( line ) ) {
					return true;
				}
			}
			return false;
		}
	}
}

const toPoint = ( x, y ) => ( { x, y } );

const ascending = ( accessor = val => val ) => ( a, b ) => accessor( a ) - accessor( b );

// Given an x,y point and a collection of same, find the count closest.
const findNearestPoints = ( p1, collection, count ) => collection
	.sort( ascending( p2 => distance( p1.x, p1.y, p2.x, p2.y ) ) )
	.slice( 0, count );

module.exports = {
	distance,
	toPoint,
	isPoint,
	findNearestPoints,
	linesIntersect,
	Circle,
	Line,
	Triangle,
};

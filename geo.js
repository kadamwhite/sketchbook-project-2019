const equalPoint = ( x1, y1, x2, y2 ) => ( x1 === x2 && y1 === y2 );

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
		this.l1 = new Line( p1.x, p1.y, p2.x, p2.y );
		this.l2 = new Line( p2.x, p2.y, p3.x, p3.y );
		this.l3 = new Line( p3.x, p3.y, p1.x, p1.y );
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

module.exports = {
	linesIntersect,
	Line,
	Triangle,
};

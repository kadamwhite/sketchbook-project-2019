const sameSign = ( a, b ) => ( a * b ) > 0;

// https://gist.github.com/lengstrom/8499382
const linesIntersect = ( l1p1, l1p2, l2p1, l2p2 ) => {
	// Compute a1, b1, c1, where line joining points 1 and 2
	// is "a1 x + b1 y + c1 = 0".
	const a1 = l1p2.y - l1p1.y;
	const b1 = l1p1.x - l1p2.x;
	const c1 = ( l1p2.x * l1p1.y ) - ( l1p1.x * l1p2.y );

	// Compute r3 and r4.
	const r3 = ( a1 * l2p1.x ) + ( b1 * l2p1.y ) + c1;
	const r4 = ( a1 * l2p2.x ) + ( b1 * l2p2.y ) + c1;

	// Check signs of r3 and r4. If both point 3 and point 4 lie on
	// same side of line 1, the line segments do not intersect.
	if ( r3 !== 0 && r4 !== 0 && sameSign( r3, r4 ) ){
		return false; //return that they do not intersect
	}

	// Compute a2, b2, c2
	const a2 = l2p2.y - l2p1.y;
	const b2 = l2p1.x - l2p2.x;
	const c2 = ( l2p2.x * l2p1.y ) - ( l2p1.x * l2p2.y );

	// Compute r1 and r2
	const r1 = ( a2 * l1p1.x ) + ( b2 * l1p1.y ) + c2;
	const r2 = ( a2 * l1p2.x ) + ( b2 * l1p2.y ) + c2;

	// Check signs of r1 and r2. If both point 1 and point 2 lie
	// on same side of second line segment, the line segments do
	// not intersect.
	if ( r1 !== 0 && r2 !== 0 && sameSign( r1, r2 ) ) {
		return false; //return that they do not intersect
	}

	return true; //lines intersect, return true
}

module.exports = {
  linesIntersect,
};

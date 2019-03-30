const {
	findNearestPoints,
	linesIntersect,
	Line,
	Triangle,
} = require( './geo' );

describe( 'geo', () => {

	describe( 'linesIntersect', () => {
		it( 'returnes true if two lines intersect', () => {
			expect( linesIntersect(
				0, 1, 1, 0,
				0, 0, 1, 1
			) ).toBe( true );
		} );

		it( 'treats colinear lines as non-overlapping', () => {
			expect( linesIntersect(
				0, 0, 2, 0,
				1, 0, 3, 0
			) ).toBe( false );
		} );

		it( 'returns false if two lines do not intersect', () => {
			expect( linesIntersect(
				0, 0, 1, 1,
				0, 1, 1, 2
			) ).toBe( false );
		} );
	} );

	describe( 'Line', () => {
		let line1;

		beforeEach( () => {
			line1 = new Line( 0, 0, 1, 1 );
		} );

		describe( 'constructor', () => {
			it( 'consistently orders points regardless of argument order', () => {
				const line2 = new Line( 1, 1, 0, 0 );
				expect( line1.points ).toEqual( line2.points );
			} );
		} );

		describe( '#intersects', () => {
			it( 'returns true when passed an intersecting Line', () => {
				const line2 = new Line( 0, 1, 1, 0 );
				expect( line1.intersects( line2 ) ).toBe( true );
				expect( line2.intersects( line1 ) ).toBe( true );
			} );

			it( 'returns false when passed a non-intersecting Line', () => {
				const line2 = new Line( 0, 1, 1, 2 );
				expect( line1.intersects( line2 ) ).toBe( false );
				expect( line2.intersects( line1 ) ).toBe( false );
			} );

			it( 'returns false when passed a non-intersecting Line with a shared point', () => {
				const line2 = new Line( 0, 0, 1, -1 );
				expect( line1.intersects( line2 ) ).toBe( false );
				expect( line2.intersects( line1 ) ).toBe( false );
			} );

			it( 'returns true when passed an intersecting Triangle', () => {
				const tri = new Triangle( 0, 1, 1, 0 );
				expect( line1.intersects( tri ) ).toBe( true );
			} );

			it( 'returns false when passed a non-intersecting Triangle', () => {
				const tri = new Triangle( 1, 0, 2, 1, 2, 0 );
				expect( line1.intersects( tri ) ).toBe( false );
			} );
		} );
	} );

	describe( 'Triangle', () => {
		let tri1;

		beforeEach( () => {
			tri1 = new Triangle( 0, 0, 1, 1, 1, 0 );
		} );

		describe( '#area', () => {
			it( 'returns the area of the triangle', () => {
				// %@#! floating point math...
				expect( tri1.area().toFixed( 1 ) ).toBe( '0.5' );
			} );
		} );

		describe( '#distance', () => {
			it( 'returns the distance between the triangles', () => {
				const tri2 = new Triangle( 2, 0, 3, 1, 3, 0 );
				expect( tri1.distance( tri2 ) ).toBe( 1 );
			} );
		} );

		describe( '#intersects', () => {
			it( 'returns true when passed an intersecting Line', () => {
				const line = new Line( 0, 1, 1, 0 );
				expect( tri1.intersects( line ) ).toBe( true );
			} );

			it( 'returns false when passed a non-intersecting Line', () => {
				const line = new Line( 0, 1, 1, 2 );
				expect( tri1.intersects( line ) ).toBe( false );
			} );

			it( 'returns true when passed an intersecting Triangle', () => {
				const tri2 = new Triangle( 0, 1, 1, 1, 1, 0 );
				expect( tri1.intersects( tri2 ) ).toBe( true );
				expect( tri2.intersects( tri1 ) ).toBe( true );
			} );

			it( 'returns true when passed another intersecting triangle', () => {
				const tri2 = new Triangle( 294, 181, 284, 211, 304, 226 );
				const tri3 = new Triangle( 304, 201, 307, 202, 291, 217 );
				expect( tri2.intersects( tri3 ) ).toBe( true );
				expect( tri3.intersects( tri2 ) ).toBe( true );
			} );

			it( 'returns false when passed a non-intersecting Triangle', () => {
				const tri2 = new Triangle( 2, 0, 3, 1, 3, 0 );
				expect( tri1.intersects( tri2 ) ).toBe( false );
				expect( tri2.intersects( tri1 ) ).toBe( false );
			} );

			it( 'returns false when passed non-overlapping Triangles where extended sides would overlap', () => {
				const tri2 = new Triangle( 2, 0, 2, 1, 3, 0 );
				expect( tri1.intersects( tri2 ) ).toBe( false );
				expect( tri2.intersects( tri1 ) ).toBe( false );
			} );

			it( 'returns false when passed a non-overlapping Triangle with a shared side', () => {
				const tri2 = new Triangle( 1, 0, 1, 1, 2, 0 );
				expect( tri1.intersects( tri2 ) ).toBe( false );
				expect( tri2.intersects( tri1 ) ).toBe( false );
			} );

			it( 'returns false when passed a non-overlapping Triangle with a colinear side', () => {
				const tri2 = new Triangle( 1, 0, 2, 1, 2, 0 );
				expect( tri1.intersects( tri2 ) ).toBe( false );
				expect( tri2.intersects( tri1 ) ).toBe( false );
			} );
		} );

		describe( '#contains', () => {
			it( 'returns true if a point lies within a triangle', () => {
				const tri = new Triangle( -1, 0, 0, 2, 1, 0 );
				expect( tri.contains( 0, 1 ) ).toBe( true );
			} );

			it( 'returns true if a point lies outside a triangle', () => {
				expect( tri1.contains( 4, 1 ) ).toBe( false );
			} );
		} );
	} );

	describe( 'findNearestPoints', () => {
		it( 'returns the specifed number of nearest points in the array', () => {
			const pt = { x: 0, y: 0 };
			const coll = [
				{ x: 1, y: 7 },
				{ x: 1, y: 0.25 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
				{ x: -1, y: 0 },
				{ x: 2, y: 0 },
				{ x: 1, y: 4 },
			];
			expect( findNearestPoints( pt, coll, 3 ) ).toEqual( [
				{ x: 0, y: 1 },
				{ x: -1, y: 0 },
				{ x: 1, y: 0.25 },
			] );
		} );
	} );

} );

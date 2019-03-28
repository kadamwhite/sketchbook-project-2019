const {
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
	} );

} );

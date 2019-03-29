const svg = require( './svg' );
const {
	Line,
	Triangle,
} = require( './geo' );

const noStyle = str => str.replace( / style="fill:none;stroke:black;stroke-width:1;"/, '' );

describe( 'svg', () => {

	describe( 'circle', () => {
		it( 'creates the svg for a point', () => {
			const point = {
				x: 1,
				y: 2,
			};
			expect( noStyle( svg.circle( point ) ) )
				.toEqual( '<circle cx="1" cy="2" r="2" />' );
		} );
		it( 'creates the svg for a point and a radius', () => {
			const point = {
				x: 1,
				y: 2,
			};
			expect( noStyle( svg.circle( point, 4 ) ) )
				.toEqual( '<circle cx="1" cy="2" r="4" />' );
		} );
	} );

	describe( 'line', () => {
		it( 'creates the SVG for a line', () => {
			const line = new Line( 0, 0, 3, 2 );
			expect( noStyle( svg.line( line ) ) )
				.toEqual( '<line x1="0" y1="0" x2="3" y2="2" />' );
		} );
	} );

	describe( 'lineFromPoints', () => {
		it( 'creates the SVG for a line', () => {
			const p1 = {
				x: 0,
				y: 0,
			};
			const p2 = {
				x: 3,
				y: 2,
			};
			expect( noStyle( svg.lineFromPoints( p1, p2 ) ) )
				.toEqual( '<line x1="0" y1="0" x2="3" y2="2" />' );
		} );
	} );

	describe( 'triangle', () => {
		it( 'creates the SVG for a triangle', () => {
			const tri = new Triangle( 0, 0, 3, 2, 4, 1 );
			expect( noStyle( svg.triangle( tri ) ) )
				.toEqual( '<polygon points="0,0 4,1 3,2 0,0" />' );
		} );
	} );
} );

const {
  linesIntersect,
} = require( './geo' );

describe( 'geo', () => {
  describe( 'linesInterset', () => {
    it( 'returnes true if two lines intersect', () => {
      const line1 = [ { x: 0, y: 1 }, { x: 1, y: 0 } ];
      const line2 = [ { x: 0, y: 0 }, { x: 1, y: 1 } ];
      expect( linesIntersect( line1[0], line1[1], line2[0], line2[1] ) ).toBe( true );
    } );
    it( 'returns false if two lines do not intersect', () => {
      const line1 = [ { x: 0, y: 1 }, { x: 1, y: 0 } ];
      const line2 = [ { x: 0, y: 2 }, { x: 1, y: 1 } ];
      expect( linesIntersect( line1[0], line1[1], line2[0], line2[1] ) ).toBe( false );
    } );
  } );
} );

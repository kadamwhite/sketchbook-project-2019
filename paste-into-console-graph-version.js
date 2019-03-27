var { convert, svgify } = (() => {
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

const omitList = [
  'IFRAME',
  'NOSCRIPT',
  'SCRIPT',
];

const isOutOfBounds = ( boundingBox, point ) => (
  point.x < boundingBox.x ||
  point.x > boundingBox.x + boundingBox.width ||
  point.y < boundingBox.y ||
  point.y > boundingBox.y + boundingBox.height
);

const ascNumericSort = ( a, b ) => a - b;
const pointsToLine = ( p1, p2 ) => {
  const sortedPoints = [ p1, p2 ].sort( ( a, b ) => ascNumericSort( a.x, b.x ) );
  const x1 = sortedPoints[0].x;
  const y1 = sortedPoints[0].y;
  const x2 = sortedPoints[1].x;
  const y2 = sortedPoints[1].y;
  const style = 'style="fill:none;stroke:black;stroke-width:1;"';
  return `<line x1="${ x1 }" y1="${ y1 }" x2="${ x2 }" y2="${ y2 }" ${ style } />`;
};

const pointToCircle = ( point ) => {
  const { x, y } = point;
  return `<circle cx="${ x }" cy="${ y }" r="1" fill="none" stroke="black" />`;
};
const addIfUnique = ( elements, element ) => {
  if ( ! elements.includes( element ) ) {
    elements.push( element );
  }
};

const nodeToSVG = container => {
  const boundingBox = container.getBoundingClientRect();
  const points = [ ...container.querySelectorAll( '*' ) ]
    .map( node => {
      if ( [ 'LINK', 'SCRIPT', 'STYLE' ].includes( node.tagName ) ) {
        return null;
      }
      const { x, y, width, height } = node.getBoundingClientRect();
      return {
        x: x + width / 2,
        y: y + height / 2,
      };
    } )
    .filter( Boolean )
    .filter( point => ! isOutOfBounds( boundingBox, point ) );

  const svgElements = [];
  points.forEach( point => {
    addIfUnique( svgElements, pointToCircle( point ) );

    points.forEach( point2 => {
      if ( distance( point, point2 ) < 0.1 * boundingBox.height ) {
        addIfUnique( svgElements, pointsToLine( point, point2 ) );
      }
    } );
  } );

    return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns:svg="http://www.w3.org/2000/svg"
  viewBox="0 0 ${ boundingBox.width } ${ boundingBox.height }"
  version="1.1"
>
  ${ svgElements.map( el => `\t${ el }` ).join( '\n' ) }
</svg>`;
};


return {
  convert: nodeToSVG,
};
})();

copy( convert( document.body ) );
// copy( svgify( document.body ) );

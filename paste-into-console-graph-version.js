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

const omitList = [
  'NOSCRIPT',
  'SCRIPT',
  'LINK',
  'OPTION',
  'STYLE',
];

const isOutOfBounds = ( boundingBox, point ) => (
  point.x < boundingBox.x ||
  point.x > boundingBox.x + boundingBox.width ||
  point.y < boundingBox.y ||
  point.y > boundingBox.y + boundingBox.height
);

const toPoint = ( x, y ) => ( { x, y } );

const ascNumericSort = ( a, b ) => a - b;
const pointsToLine = ( p1, p2 ) => {
  const sortedPoints = [ p1, p2 ].sort( ( a, b ) => ascNumericSort( a.x * a.y, b.x * b.y ) );
  const x1 = sortedPoints[0].x;
  const y1 = sortedPoints[0].y;
  const x2 = sortedPoints[1].x;
  const y2 = sortedPoints[1].y;
  const style = 'style="fill:none;stroke:black;stroke-width:1;"';
  return `<line x1="${ x1 }" y1="${ y1 }" x2="${ x2 }" y2="${ y2 }" ${ style } />`;
};

const pointToCircle = ( point ) => {
  const { x, y } = point;
  return `<circle cx="${ x }" cy="${ y }" r="2" fill="none" stroke="black" />`;
};
const addIfUnique = ( elements, element ) => {
  if ( ! elements.includes( element ) ) {
    elements.push( element );
  }
};

const nextFrame = () => new Promise( resolve => setTimeout( resolve, 0 ) );

const injectProgressIndicator = () => {
  let indicator = document.getElementById( 'progress-indicator' );
  if ( indicator ) {
    return indicator;
  }
  indicator = document.createElement( 'script' );
  indicator.id = 'progress-indicator';
  indicator.type = 'text/html';
  indicator.setAttribute( 'data-progress', '0%' );
  document.body.append( indicator );
  return indicator;
}

const nodeToSVG = async container => {
  const indicator = injectProgressIndicator();
  const boundingBox = container.getBoundingClientRect();

  // const maxDiagonal = distance( toPoint( 0, 0 ), toPoint( boundingBox.width, boundingBox.height ) );
  // const minLineLength = 0.05 * maxDiagonal;
  // const maxLineLength = 0.15 * maxDiagonal;
  const minLineLength = 0.15 * boundingBox.width;
  const maxLineLength = 0.3 * boundingBox.width;

  const points = [ ...container.querySelectorAll( '*' ) ]
    .map( node => {
      if ( omitList.includes( node.tagName ) ) {
        return null;
      }
      const { x, y, width, height } = node.getBoundingClientRect();
      const cx = x + width / 2;
      const cy = y + height / 2;
      if ( cx === 0 && cy === 0 ) {
        return null;
      }
      return {
        x: cx,
        y: cy,
      };
    } )
    .filter( Boolean )
    .filter( point => ! isOutOfBounds( boundingBox, point ) );

  const increment = 1 / points.length;
  let progress = 0;

  const svgElements = [];
  let currentIdx = 0;
  for ( let point of points ) {
    addIfUnique( svgElements, pointToCircle( point ) );

    let batchSize = 100;
    const remainingPoints = points
      .slice( currentIdx + 1 )
      .filter( point2 => {
        const dist = distance( point, point2 );
        return dist > minLineLength && dist < maxLineLength;
      } );

    // for ( let point2 of randomSampleArray( remainingPoints, 1 ) ) {
    for ( let point2 of randomSampleArray( remainingPoints, 10 ) ) {
      addIfUnique( svgElements, pointsToLine( point, point2 ) );
      batchSize -= 1;
      if ( batchSize < 0 ) {
        batchSize = 100;
        await nextFrame();
      }
    }

    currentIdx += 1;
    progress = progress + increment;
    indicator.setAttribute( 'data-progress', `${ parseInt( progress * 100, 10 ) }%` );
  }

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


return { convert: nodeToSVG };
})();

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

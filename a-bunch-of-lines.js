const svg = require( './svg' );
const {
	Line,
} = require( './geo' );

const start = 20;
const end = 600;
const avgWidth = 80;

const randWidth = () => Math.random() * 0.4 * avgWidth + ( avgWidth / 2 );

const randLine = pt => {
	const width = randWidth();
	const x1 = pt.x + (
		Math.random() * 10 - 5
	) - width / 2;
	const x2 = x1 + width;
	const y1 = pt.y + Math.random() * 2 - 1;
	const y2 = pt.y + Math.random() * 2 - 1;
	return new Line( x1, y1, x2, y2 );
};

let pt = {
	x: avgWidth * 2,
	y: start,
};

const lines = [];
const i = 1;
while ( pt.y < end ) {
	const line = randLine( pt, i );
	lines.push( line );
	svg.add( svg.line( line ) );
}
const output = svg.render( {
	width: 3 * avgWidth,
	height: end + start,
} );

document.body.innerHTML = output;

window.svg = output;


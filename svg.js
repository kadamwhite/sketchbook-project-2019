const {
	Line,
} = require( './geo' );

const removeLinebreaks = str => str.replace( /\n\t*/g, ' ' );

/**
 * Convert a Point or a Circle into a line.
 *
 * @param {Circle|Point} shape    A circle or a point.
 * @param {Number}       [radius] An optional radius; if a Circle is provided, this argument is ignored.
 */
const circle = ( shape, radius = 2 ) => {
	const { x, y } = shape;
	const r = shape.r || radius;
	return removeLinebreaks( `<circle
		cx="${ x }"
		cy="${ y }"
		r="${ r }"
		style="fill:none;stroke:black;stroke-width:1;"
	/>` );
};

const line = line => removeLinebreaks( `<line
	x1="${ line.p1x }"
	y1="${ line.p1y }"
	x2="${ line.p2x }"
	y2="${ line.p2y }"
	style="fill:none;stroke:black;stroke-width:1;"
/>` );

const lineFromPoints = ( p1, p2 ) => line( new Line( p1.x, p1.y, p2.x, p2.y ) );

const xyPair = ( x, y ) => `${ x },${ y }`;
const triangle = tri => removeLinebreaks( `<polygon
	points="${ xyPair( tri.p1x, tri.p1y ) } ${ xyPair( tri.p2x, tri.p2y ) } ${ xyPair( tri.p3x, tri.p3y ) } ${ xyPair( tri.p1x, tri.p1y ) }"
	style="fill:none;stroke:black;stroke-width:1;"
/>` );

const elements = [];
const add = element => {
	if ( ! elements.includes( element ) ) {
		elements.push( element );
	}
}
const render = ( { width, height }, els = null ) => `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
	xmlns:svg="http://www.w3.org/2000/svg"
	viewBox="0 0 ${ width } ${ height }"
	version="1.1"
>
${ ( els || elements ).map( el => `\t${ el }` ).join( '\n' ) }
</svg>`.replace( /^\n/, '' );

module.exports = {
	circle,
	line,
	lineFromPoints,
	triangle,
	add,
	render,
};

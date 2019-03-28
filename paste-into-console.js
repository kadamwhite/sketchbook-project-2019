/* global copy:false */
let { convert, svgify } = ( () => {
	function sum( collection, prop ) {
		return collection.reduce( ( sum, item ) => sum + item[prop], 0 );
	}

	function testEq( a, b ) {
		if ( a !== b ) {
			throw new Error( `Expected ${ a } to equal ${ b }` );
		}
	}

	testEq( 8, sum( [ { a: 1 }, { a: 4 }, { a: 3 } ], 'a' ) );

	const omitList = [
		'IFRAME',
		'NOSCRIPT',
		'SCRIPT',
	];

	const convertNode = node => {
		if ( omitList.includes( node.tagName ) ) {
			node.remove();
			return null;
		}
		const children = (
		// Treat SVG as one unit
			node.tagName !== 'SVG'
		) && (
		// Must have child nodes
			node.children && node.children.length
		) ?
			[ ...node.children ].map( convertNode ).filter( Boolean ) :
			null;
		return {
			type: node.nodeType,
			tag: node.tagName,
			size: children ?
				Math.ceil( Math.sqrt( sum( children, 'size' ) ) ) :
				1,
			children,
		};
	};

	const nodeToHTML = node => {
		const el = document.createElement( node.tag );
		el.innerHTML = node.children ?
			node.children.map( nodeToHTML ).join( '\n' ) :
			'';
		if ( node.size > 1 ) {
			el.style.width = `${ node.size }em !important`;
			el.style.height = `${ node.size }em !important`;
		} else {
			el.style.width = '0.1em !important';
			el.style.height = '0.1em !important';
		}
		return el.outerHTML;
	};

	[ ...document.head.children ].forEach( node => {
		if ( [ 'LINK', 'SCRIPT', 'STYLE' ].includes( node.tagName ) ) {
			node.remove();
		}
	} );

	const styleNode = document.createElement( 'style' );
	styleNode.type = 'text/css';
	styleNode.innerHTML = `
div, time,
svg, canvas, img, figure, figcaption,
p, a, h1, h2, h3, h4, h5, h6,
em, strong, small, span,
ul, ol, dd, dl, li,
button, textarea, input, form,
section, main, header, footer, nav
{
  min-width: 0.2rem;
  min-height: 0.2rem;
  width: auto !important;
  border: 1px solid black;
  background: transparent !important;
  display: inline-block !important;
  margin: 0rem !important;
  padding: 0.25rem !important;
  vertical-align: top;
  line-height: 0;
}
ul {
  list-style-type: none;
}
img, svg, canvas, input, textarea {
  width: 1rem !important;
  height: 1rem !important;
}
`;
	// p, li, a, span {
	//   height: 0.5em !important;
	// }
	document.head.append( styleNode );

	function svgify( node ) {
		const rects = [];
		const style = 'style="fill:none;stroke:#000000;"';
		const max = {
			x: 0,
			y: 0,
		};
		function svgifyNode( node ) {
			const { x, top: y, width, height } = node.getBoundingClientRect();
			max.x = Math.max( max.x, x + width );
			max.y = Math.max( max.y, y + height );
			rects.push(
				`<rect ${ style } x="${ x }" y="${ y }" width="${ width }" height="${ height }" />`
			);
			[ ...node.children ].forEach( svgifyNode );
		}
		svgifyNode( node );
		return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns:svg="http://www.w3.org/2000/svg"
  viewBox="0 0 ${ max.x } ${ max.y }"
  version="1.1"
>
  ${ rects.join( '\n' ) }
</svg>`;
	}

	return {
		convert: function ( node ) {
			node.outerHTML = nodeToHTML( convertNode( node ) );
		},
		svgify,
	};
} )();

convert( document.body );
copy( svgify( document.body ) );

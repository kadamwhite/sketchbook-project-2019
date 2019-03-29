const omitList = [
	'LINK',
	'NOSCRIPT',
	'OPTION',
	'SCRIPT',
	'STYLE',
];

const isOOB = ( boundingBox, point ) => (
	point.x < boundingBox.x ||
	point.x > boundingBox.x + boundingBox.width ||
	point.y < boundingBox.y ||
	point.y > boundingBox.y + boundingBox.height
);

const nodesToCenterpoints = ( container, dedupe ) => {
	const boundingBox = container.getBoundingClientRect();
	const existingPoints = {};
	return [ ...container.querySelectorAll( '*' ) ]
		.map( node => {
			if ( omitList.includes( node.tagName ) ) {
				return null;
			}
			const { x, y, width, height } = node.getBoundingClientRect();
			const cx = x + width / 2;
			const cy = y + height / 2;
			// Remove items at the periphery.
			if ( cx === 0 || cy === 0 || cx === width || cy === height ) {
				return null;
			}
			if ( existingPoints[ `${ cx },${ cy }` ] ) {
				return null;
			}
			existingPoints[ `${ cx },${ cy }` ] = true;
			const point = {
				x: cx,
				y: cy,
				count: 0,
			};
			if ( isOOB( boundingBox, point ) ) {
				return null;
			}
			return point;
		} )
		.filter( Boolean );
};

const appendStyle = styles => {
	const styleNode = document.createElement( 'style' );
	styleNode.type = 'text/css';
	styleNode.innerHTML = styles;
	global.document.head.append( styleNode );
};

let indicator;
const injectProgressIndicator = () => {
	indicator = global.document.getElementById( 'progress-indicator' );
	if ( indicator ) {
		return indicator;
	}
	indicator = global.document.createElement( 'script' );
	indicator.id = 'progress-indicator';
	indicator.type = 'text/html';
	indicator.setAttribute( 'data-progress', '0%' );
	global.document.body.append( indicator );
	return indicator;
};

const updateProgressIndicator = progress => {
	if ( ! indicator ) {
		injectProgressIndicator();
	}
	indicator.setAttribute( 'data-progress', `${ parseInt( progress * 100, 10 ) }%` );
};

module.exports = {
	appendStyle,
	injectProgressIndicator,
	updateProgressIndicator,
	nodesToCenterpoints,
};

/**
 * @module components/views/Icon
 */
import React from 'react';
import PropTypes from 'prop-types';
import GLYPHS from '../../img/svg-sprite.js';

export function Icon(props) {
	var className = props.glyph.replace(/^#/, '');

	return (
		<svg className="icon" width={props.width} height={props.height}>
			<use xlinkHref={props.glyph} className={className}/>
		</svg>
	);
}

Icon.defaultProps = {
	width: 16,
	height: 16
};

Icon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	glyph: PropTypes.string,
};

export { GLYPHS };
/**
 * @module components/views/Icon
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Icon glyphs available for use.
 * @property {string} TEXT
 * @property {string} PUZZLE_PIECE
 * @property {string} TAG
 * @property {string} COMPASS
 * @property {string} LOOP_CIRCULAR
 * @property {string} MEDIA_PLAY
 * @property {string} LIGHTBULB
 * @property {string} RESIZE_WIDTH
 */
// export const GLYPHS = {
// 	TEXT: require('../../img/svg/text.svg'),
// 	PUZZLE_PIECE: require('../../img/svg/puzzle-piece.svg'),
// 	TAG: require('../../img/svg/tag.svg'),
// 	COMPASS: require('../../img/svg/compass.svg'),
// 	LOOP_CIRCULAR: require('../../img/svg/loop-circular.svg'),
// 	MEDIA_PLAY: require('../../img/svg/media-play.svg'),
// 	LIGHTBULB: require('../../img/svg/lightbulb.svg'),
// 	RESIZE_WIDTH: require('../../img/svg/resize-width.svg'),
// 	WARNING: require('../../img/svg/warning.svg'),
// };

export const GLYPHS = {
	TEXT: '',
	PUZZLE_PIECE: '',
	TAG: '',
	COMPASS: '',
	LOOP_CIRCULAR: '',
	MEDIA_PLAY: '',
	LIGHTBULB: '',
	RESIZE_WIDTH: '',
	WARNING: '',
};

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
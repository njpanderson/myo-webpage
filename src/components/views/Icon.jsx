import React, { PropTypes } from 'react';

export const GLYPHS = {
	TEXT: require('../../img/svg/text.svg'),
	PUZZLE_PIECE: require('../../img/svg/puzzle-piece.svg'),
	TAG: require('../../img/svg/tag.svg'),
	COMPASS: require('../../img/svg/compass.svg'),
	LOOP_CIRCULAR: require('../../img/svg/loop-circular.svg'),
	MEDIA_PLAY: require('../../img/svg/media-play.svg'),
	LIGHTBULB: require('../../img/svg/lightbulb.svg'),
	RESIZE_WIDTH: require('../../img/svg/resize-width.svg'),
};

export function Icon(props) {
	return (
		<svg className="icon" width={props.width} height={props.height}>
			<use xlinkHref={props.glyph}/>
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
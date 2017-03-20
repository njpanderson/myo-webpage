import React, { PropTypes } from 'react';

import { GLYPHS, Icon } from '../views/Icon.jsx';

var DialogHeading = function(props) {
	var notes = [],
		icon;

	props.notes.forEach((note, index) => (notes.push(
		<p key={'note-' + index}>{note}</p>
	)));

	if (props.iconGlyph) {
		icon = <Icon glyph={props.iconGlyph}/>;
	}

	return (
		<div className={props.className}>
			<h2>
				{icon}
				<span>{props.title}</span>
			</h2>
			{notes}
		</div>
	);
};

DialogHeading.propTypes = {
	iconGlyph: PropTypes.string,
	className: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	notes: PropTypes.arrayOf(PropTypes.string)
};

export default DialogHeading;
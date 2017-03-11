import React, { PropTypes } from 'react';

var DialogHeading = function(props) {
	var notes = [];

	props.notes.forEach((note, index) => (notes.push(
		<p key={'note-' + index}>{note}</p>
	)));

	return (
		<div className={props.className}>
			<h2>{props.title}</h2>
			{notes}
		</div>
	);
};

DialogHeading.propTypes = {
	className: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	notes: PropTypes.arrayOf(PropTypes.string)
};

export default DialogHeading;
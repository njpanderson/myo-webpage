import React, { PropTypes } from 'react';

var Droplet = function(props) {
	var classes = ['droplet'];

	if (props.attached) {
		classes.push('attached');
	}

	return (
		<a href="#"
			name={props.id}
			className={classes.join(' ')}
			onClick={() => { props.onValidDrop(props.id); }}>
			{props.name}
		</a>
	);
};

Droplet.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string,
	attached: PropTypes.bool,
	onValidDrop: PropTypes.func
};

module.exports = Droplet;
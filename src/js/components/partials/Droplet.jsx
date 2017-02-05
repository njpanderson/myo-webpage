import React, { PropTypes } from 'react';

var Droplet = function(props) {
	var classes = ['droplet'];

	return (
		<a href="#" name={props.id} className={classes.join(' ')}>
			{props.name}
		</a>
	);
};

Droplet.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string
};

module.exports = Droplet;
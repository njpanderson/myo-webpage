import React, { PropTypes } from 'react';

var View = function() {
	return (
		<section className="view">[view]</section>
	);
};

View.propTypes = {
	html: PropTypes.string
};

export default View;
import React, { PropTypes } from 'react';

var FieldText = function(props) {
	return (
		<div className="field">
			<label>{props.label}</label>
			<input type="text" name={props.name} onChange={props.onChange}/>
		</div>
	);
};

FieldText.propTypes = {
	label: PropTypes.string
};

FieldText.defaultProps = {};

export default FieldText;
import React, { PropTypes } from 'react';

function TextField(props) {
	return (
		<div className="field">
			<label>{props.label}</label>
			<input
				type="text"
				name={props.name}
				onChange={props.onChange}
				value={props.value}/>
		</div>
	);
}

TextField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func
};

TextField.defaultProps = {};

export default TextField;
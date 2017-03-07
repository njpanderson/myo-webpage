import React, { PropTypes } from 'react';

function DropDown(props) {
	return (
		<div className="field">
			<label>{props.label}</label>
			<select
				type="text"
				name={props.name}
				onChange={props.onChange}
				value={props.value}>
				{props.children}
			</select>
		</div>
	);
}

DropDown.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func,
	children: React.PropTypes.node
};

DropDown.defaultProps = {};

export default DropDown;
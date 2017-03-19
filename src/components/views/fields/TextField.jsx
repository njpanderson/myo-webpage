import React from 'react';

import { field } from '../../../assets/common-prop-types';

function TextField(props) {
	var label = props.field.label || props.field.name;

	return (
		<div className="field">
			<label>{label}</label>
			<input
				type="text"
				name={props.field.name}
				placeholder={props.field.placeholder}
				onChange={props.onChange}
				maxLength={props.field.data.maxlength}
				value={props.value}/>
		</div>
	);
}

TextField.propTypes = field;

export default TextField;
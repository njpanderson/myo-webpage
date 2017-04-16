import React from 'react';

import { field } from '../../../assets/common-prop-types';
import { getFieldErrorMarkup } from '../../component-utils.jsx';

function TextField(props) {
	var label = props.field.label || props.field.name;

	return (
		<div className={props.className.join(' ')}>
			<label>{label}</label>
			<input
				type="text"
				name={props.field.name}
				placeholder={props.field.placeholder}
				onChange={props.onChange}
				maxLength={props.field.data.maxlength}
				value={props.value}
				ref={props.refCollector}/>
			{getFieldErrorMarkup(props.error)}
		</div>
	);
}

TextField.propTypes = field;

export default TextField;
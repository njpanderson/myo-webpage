import React from 'react';

import { field } from '../../../assets/common-prop-types';
import { optionValueSet, getFieldErrorMarkup } from '../../component-utils.jsx';

function DropDown(props) {
	var label = props.field.label || props.field.name;

	return (
		<div className={props.className.join(' ')}>
			<label>{label}</label>
			<select
				type="text"
				name={props.field.name}
				onChange={props.onChange}
				value={props.value}
				ref={props.refCollector}>
				{optionValueSet(props.field.options)}
			</select>
			{getFieldErrorMarkup(props.error)}
		</div>
	);
}

DropDown.propTypes = field;

export default DropDown;
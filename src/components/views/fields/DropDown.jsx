import React from 'react';

import { field } from '../../../assets/common-prop-types';
import { optionValueSet } from '../../component-utils.jsx';

function DropDown(props) {
	var label = props.field.label || props.field.name;

	return (
		<div className="field">
			<label>{label}</label>
			<select
				type="text"
				name={props.field.name}
				onChange={props.onChange}
				value={props.value}
				ref={props.refCollector}>
				{optionValueSet(props.field.options)}
			</select>
		</div>
	);
}

DropDown.propTypes = field;

export default DropDown;
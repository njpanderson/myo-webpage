import React, { Component, PropTypes } from 'react';

import FormField from '../lib/FormField';
import TextField from './views/fields/TextField.jsx';
import DropDown from './views/fields/DropDown.jsx';

const FieldComponents = {
	'text': TextField,
	'dropdown': DropDown
};

class Fieldset extends Component {
	constructor(props) {
		var formValues = {};

		super(props);

		// set default state for fields based on original values
		this.props.fields.forEach((field) =>
			(formValues[field.name] = field.value || '')
		);

		// set default form value state
		this.state = {
			formValues
		};

		// bind functions for events
		this.elementChange = this.elementChange.bind(this);
	}

	fields() {
		var Component,
			output = [];

		this.props.fields.forEach((field) => {
			var key = 'field-' + field.name;

			Component = FieldComponents[field.type];

			switch (field.type) {
			case 'text':
				output.push(
					<Component key={key}
						field={field}
						onChange={this.elementChange}
						value={this.state.formValues[field.name]}/>
				);
				break;

			case 'dropdown':
				output.push(
					<Component key={key}
						field={field}
						onChange={this.elementChange}
						value={this.state.formValues[field.name]}/>
				);
			}
		});

		return output;
	}

	elementChange(event) {
		var target = event.target,
			formValues = Object.deepAssign({}, this.state.formValues);

		formValues[target.name] = target.value;

		this.setState({
			formValues: formValues
		});

		this.props.onFieldUpdate(this.props.set, target.name, target.value, formValues);
	}

	render() {
		return (
			<fieldset>
				<legend>{this.props.legend}</legend>
				{this.fields()}
			</fieldset>
		);
	}
}

Fieldset.propTypes = {
	set: PropTypes.string.isRequired,
	onFieldUpdate: PropTypes.func.isRequired,
	legend: PropTypes.string,
	fields: PropTypes.arrayOf(React.PropTypes.instanceOf(FormField))
};

Fieldset.defaultProps = {
	onFieldUpdate: () => {},
	fields: {}
};

export default Fieldset;
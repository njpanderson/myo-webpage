import React, { Component, PropTypes } from 'react';

import TextField from './views/fields/TextField.jsx';
import DropDown from './views/fields/DropDown.jsx';

const FieldComponents = {
	'text': TextField,
	'dropdown': DropDown
};

class Fieldset extends Component {
	constructor(props) {
		var name, formValues = {};

		super(props);

		// set default state for fields based on original values
		for (name in this.props.fields) {
			formValues[name] = this.props.fields[name].value;
		}

		// set default form value state
		this.state = {
			formValues
		};

		// bind functions for events
		this.elementChange = this.elementChange.bind(this);
	}

	valueSet(values, node) {
		var nodes = [], key;

		if (Array.isArray(values)) {
			values.forEach(function(value) {
				nodes.push(
					<node value={value}>{value}</node>
				);
			});
		} else if (typeof values === 'object') {
			for (key in values) {
				nodes.push(
					<node value={key}>{values[key]}</node>
				);
			}
		}

		return nodes;
	}

	fields() {
		var name, field, Component, value, label,
			output = [];
		console.log('Fieldset fields', this.props.fields);
		for (name in this.props.fields) {
			field = this.props.fields[name];
			field.key = 'field-' + name;

			Component = FieldComponents[field.type];

			value = this.state.formValues[name];
			label = field.label || name;

			switch (field.type) {
			case 'text':
				output.push(
					<Component key={field.key}
						onChange={this.elementChange}
						name={name}
						value={value}
						label={label}/>
				);
				break;

			case 'dropdown':
				output.push(
					<Component key={field.key}
						onChange={this.elementChange}
						name={name}
						value={value}
						label={label}>
						{this.valueSet(field.value, 'option')}
					</Component>
				);
			}
		}

		return output;
	}

	elementChange(event) {
		var target = event.target,
			state = {};

		console.log('Fieldset component change', event, event.target);
		state[target.name] = target.value;

		this.setState({
			formValues: state
		});

		this.props.onFieldUpdate(target.name, target.value, this.state);
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
	onFieldUpdate: PropTypes.func,
	fields: PropTypes.object // !TODO - ensure all fields have a value with a custom propTypes func
};

Fieldset.defaultProps = {
	onFieldUpdate: () => {},
	fields: {}
};

export default Fieldset;
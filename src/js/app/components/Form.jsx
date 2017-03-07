import React, { Component, PropTypes } from 'react';

import TextField from './views/fields/TextField.jsx';
import DropDown from './views/fields/DropDown.jsx';

const FieldComponents = {
	'text': TextField,
	'dropdown': DropDown
};

class Form extends Component {
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
		console.log(this.props.fields);
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
		var target = event.target;
		console.log('Form component element change', event, event.target);
		var state = {};
		state[target.name] = target.value;

		this.setState({
			formValues: state
		});
	}

	onSubmit(event) {
		event.preventDefault();
		this.props.onSubmit(this.state.formValues);
	}

	onCancel() {
		this.props.onCancel(this.state.formValues);
	}

	render() {
		return (
			<form action="" onSubmit={this.onSubmit.bind(this)}>
				<div className="fields">
					<fieldset>
						{this.fields()}
					</fieldset>
				</div>
				<fieldset className="buttons">
					<button type="button" onClick={this.onCancel.bind(this)}>Cancel</button>
					<button type="submit">Save</button>
				</fieldset>
			</form>
		);
	}
}

Form.propTypes = {
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	fields: PropTypes.object
};

Form.defaultProps = {
	onCancel: () => {},
	onSubmit: () => {},
	fields: {}
};

export default Form;
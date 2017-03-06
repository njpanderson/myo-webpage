import React, { Component, PropTypes } from 'react';

import TextField from './views/fields/TextField.jsx';

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

	fields() {
		var output, name, field, key;

		output = [];

		for (name in this.props.fields) {
			field = this.props.fields[name];
			key = 'field-' + name;

			switch (field.type) {
			case 'text':
				// assume the field is text
				output.push(
					<TextField key={key}
						onChange={this.elementChange}
						name={name}
						value={this.getFieldValue(name, field.value)}
						label={field.label || name}/>
				);
			}
		}

		return output;
	}

	getFieldValue(name, default_value = null) {
		if (this.state && this.state.formValues) {
			this.state.formValues[name] || null;
		} else {
			return default_value;
		}
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
import React, { Component } from 'react';
import CommonPropTypes from '../assets/common-prop-types.js';

import FieldText from './partials/FieldText.jsx';

class Form extends Component {
	constructor() {
		super();

		this.elementChange = this.elementChange.bind(this);
	}

	fields() {
		var output, name, field, key;

		output = [];

		for (name in this.props.fields) {
			field = this.props.fields[name];
			key = 'field-' + name;

			if (!field.values) {
				// assume the field is text
				output.push(
					<FieldText key={key}
						onChange={this.elementChange}
						name={name}
						value={this.getFieldValue(name)}
						label={field.label}/>
				);
			}
		}

		return output;
	}

	getFieldValue(name) {
		if (this.state && this.state.formValues) {
			this.state.formValues[name] || null;
		} else {
			return null;
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

		if (typeof this.props.onSubmit === 'function') {
			this.props.onSubmit();
		}
	}

	onCancel() {
		if (typeof this.props.onCancel === 'function') {
			this.props.onCancel();
		}
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

Form.propTypes = Object.assign({}, CommonPropTypes, {
	// state: PropTypes.object
});

Form.defaultProps = {};

export default Form;
/**
 * @typedef FormOnSubmit
 * @param {object} formValues - the current values of the form elements, as an object.
 */

/**
 * @typedef FormFieldSets
 * @description
 * An array of fieldsets — each item of which contains an object defining a
 * single fieldset. See {@link FormFieldset}.
 * @example
 * var fieldsets = [
 * 	{@link FormFieldSet}...
 * ];
 */

/**
 * An object defining a single fieldset.
 * @typedef FormFieldSet
 * @property {string} key - Unique key value.
 * @property {string} legend - Legend label.
 * @property {object} fields - Fields within the fieldset. The keys of which
 * should represent the name of the field, with the values being one of
 * {@link FormField} each.
 * @example
 * var fieldset = [
 * 	{@link FormField}...
 * ]
 */
import React, { Component, PropTypes } from 'react';

import Fieldset from './Fieldset.jsx';
import Button from './Button.jsx';

/**
 * @description
 * Takes a form specification and produces an HTML form.
 * See {@link Form.propTypes} for more information
 */
class Form extends Component {
	constructor(props) {
		var formValues = {};

		super(props);

		// set default state for fields based on original values
		this.props.fieldSets.forEach((set) => {
			formValues[set.key] = {};

			set.fields.forEach((field) =>
				(formValues[set.key][field.name] = field.value)
			);
		});

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

	fieldSets() {
		var output = [];

		this.props.fieldSets.forEach((set) => {
			const key = 'fieldset-' + set.key;

			output.push(
				<Fieldset
					key={key}
					set={set.key}
					fields={set.fields}
					legend={set.legend}
					onFieldUpdate={this.elementChange}
					/>
			);
		});

		return output;
	}

	elementChange(set, name, value, values_state) {
		var sets = Object.assign({}, this.state.formValues);

		sets[set] = values_state;

		this.setState({
			formValues: sets
		});
	}

	onSubmit(event) {
		event.preventDefault();
		this.props.onSubmit(this.state.formValues);
	}

	getButtons() {
		var buttons = [];

		if (this.props.buttons && this.props.buttons.length) {
			this.props.buttons.forEach((button, index) => {
				buttons.push(
					<Button
						key={'button-' + index}
						type={button.type}
						label={button.label}
						className={button.className}
						onCancel={this.props.onCancel}
						onClick={button.onClick}/>
				);
			});
		}

		return buttons;
	}

	render() {
		return (
			<form action="" onSubmit={this.onSubmit.bind(this)}>
				<div className="fields">
					{this.fieldSets()}
				</div>
				<fieldset className="buttons">
					{this.getButtons()}
				</fieldset>
			</form>
		);
	}
}

/**
 * @property {function} onCancel - invoked when the form is cancelled
 * @property {FormOnSubmit} onSubmit - invoked when the form is submitted
 * @property {FormFieldSets} fieldSets - fieldsets for display
 */
Form.propTypes = {
	onCancel: PropTypes.func,
	onSubmit: PropTypes.func,
	fieldSets: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string,
		legend: PropTypes.string,
		fields: PropTypes.array
	})),
	buttons: PropTypes.array
};

Form.defaultProps = {
	onCancel: () => {},
	onSubmit: () => {},
	fieldSets: {}
};

export default Form;
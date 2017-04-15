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

/**
 * @typedef FormButton
 * @property {string} type - Either 'cancel', 'submit' or a custom type.
 * @property {string} label - Button label.
 * @property {object} data - Data sent as `data` to the form onSubmit prop.
 * @property {object} className - Extra class name(s) for the button.
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

		this.ui = {
			refs: {
				buttons: {},
				fields: {}
			}
		};

		// set default state for fields based on original values
		if (this.props.fieldSets) {
			this.props.fieldSets.forEach((set) => {
				formValues[set.key] = {};

				set.fields.forEach((field) =>
					(formValues[set.key][field.name] = field.value)
				);
			});
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

	fieldSets() {
		var output = [];

		if (this.props.fieldSets) {
			this.props.fieldSets.forEach((set) => {
				const key = 'fieldset-' + set.key;

				output.push(
					<Fieldset
						key={key}
						refCollector={this.collectFieldRef.bind(this)}
						set={set.key}
						fields={set.fields}
						legend={set.legend}
						onFieldUpdate={this.elementChange}
						/>
				);
			});
		}

		return output;
	}

	elementChange(set, name, value, values_state) {
		var sets = Object.assign({}, this.state.formValues);

		sets[set] = values_state;

		this.setState({
			formValues: sets
		});
	}

	componentOnSubmit(proxy_event) {
		this.onSubmit(proxy_event, 'submit');
	}

	onSubmit(event, button, button_data) {
		if (event) {
			event.preventDefault();
		}

		this.props.onSubmit(this.state.formValues, button, button_data);
	}

	/**
	 * Return a function to collect Button component DOM references.
	 */
	collectButtonRef(key) {
		return function(ref) {
			this.ui.refs.buttons[key] = ref;
		}.bind(this);
	}

	/**
	 * @description
	 * Collect a reference to a field. Each field component uses two arguments
	 * for their refCollector prop (unlike the usual one):
	 * 1. An identifying key
	 * 2. The DOM reference
	 */
	collectFieldRef(key, ref) {
		this.ui.refs.fields[key] = ref;
	}

	componentDidMount() {
		var a, b, key;

		if ('ontouchstart' in window) {
			// if it's a touch device, it'll likely have an on-screen keyboard
			// which could get in the way of the dialog opening and cause UX issues.
			return;
		}

		// handle focusing of the first field (or button) in the form
		if (this.props.fieldSets && this.props.fieldSets.length) {
			// highlight first collected field
			for (a = 0; a < this.props.fieldSets.length; a += 1) {
				for (b = 0; b < this.props.fieldSets[a].fields.length; b += 1) {
					key = 'field-' + this.props.fieldSets[a].fields[b].name;

					if (this.props.fieldSets[a].fields[b].type !== 'hidden' &&
						this.ui.refs.fields[key]) {
						this.ui.refs.fields[key].focus();
						a = this.props.fieldSets.length;
						break;
					}
				}
			}
		} else {
			// highlight first collected button
			this.props.buttons.forEach((button, index) => {
				var key = 'button-' + index;

				if (this.ui.refs.buttons[key] && button.type === 'submit') {
					this.ui.refs.buttons[key].focus();
				}
			});
		}
	}

	/**
	 * @description
	 * Iterate through the `buttons` object in `props` and produce a list of Button
	 * components.
	 */
	getButtons() {
		var buttons = [];

		if (this.props.buttons && this.props.buttons.length) {
			this.props.buttons.forEach((button, index) => {
				var key = 'button-' + index,
					click_function;

				click_function = ((component, key) => {
					return function(event) {
						if (component.ui.refs.buttons && component.ui.refs.buttons[key]) {
							component.ui.refs.buttons[key].blur();
							component.props.onButtonClick(component.ui.refs.buttons[key], event);
						}

						if (button.type === 'cancel') {
							// cancel button
							component.props.onCancel();
						} else if (button.type !== 'submit') {
							// anything except submit
							component.onSubmit(null, button.type, button.data);
						}
					};
				})(this, key, button.onClick);

				buttons.push(
					<Button
						key={key}
						refCollector={this.collectButtonRef(key)}
						type={button.type}
						label={button.label}
						className={button.className}
						onClick={click_function}/>
				);
			});
		}

		return buttons;
	}

	render() {
		return (
			<form action="" onSubmit={this.componentOnSubmit.bind(this)}>
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
	onButtonClick: PropTypes.func.isRequired,
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
	onSubmit: () => {}
};

export default Form;
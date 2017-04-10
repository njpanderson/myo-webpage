'use strict';

/**
 * A single `editable` defiition to produce one field.
 * @typedef EditableItemDefinition
 * @property {string} type - One of 'text', 'longtext', 'dropdown', 'checkbox', or 'radio'.
 * @property {bool} [required] - Whether the field must be filled in or not.
 * @property {mixed} [value] - Either an array of values, or a single string value.
 * @property {string} [placeholder] - In the case of a text value, this will show in place of empty values.
 * @property {string} [selected] - In the case of an array value, this set the value as 'selected'.
 */

import PropTypes from './PropTypes';
import FormField from './FormField';

var Droplet, droplet_id = 0;

/**
 * Individual droplet class. Handles validation of props in a similar fashion to
 * React, but (probably) with a lot less style.
 * @class
 */
Droplet = function(settings = {}, id) {
	if (typeof id === 'number') {
		this.id = 'droplet_' + id;
	} else {
		this.id = 'droplet_' + ++droplet_id;
	}

	this._originalSettings = Object.deepAssign({}, settings);
	this.data = {};
	this.name = null;
	this.dropletType = null;
	this.attachmentIds = [];

	this.init();
};

Droplet.prototype = {
	/**
	 * Initialisation.
	 * @private
	 */
	init: function() {
		// set base properties for all droplets
		this._validateAndSet([
			'name',
			'dropletType',
			'attachmentIds',
			'editable',
			'guidance'
		], this);

		// check droplet type is valid
		switch (this.dropletType) {
		case 'element':
		case 'text':
		case 'attribute':
			this._setExtraFields();
			break;

		default:
			throw new Error('Droplet type ' + this.dropletType + ' is invalid.');
		}
	},

	/**
	 * Registers type specific fields for validation.
	 * @private
	 */
	_setExtraFields: function() {
		switch (this.dropletType) {
		case 'text':
			this._validateAndSet(['value'], this.data);
			break;

		case 'element':
			this._validateAndSet(['attrs', 'tagName', 'innerHTML'], this.data);
			break;

		case 'attribute':
			this._validateAndSet(['key', 'value'], this.data);
			break;
		}
	},

	/**
	 * Validates (using the PropType functions) and sets the instance values
	 * given the defined properties.
	 */
	_validateAndSet(values, context) {
		values.forEach((value) => {
			if (Droplet.PropTypes.hasOwnProperty(value)) {
				if (Droplet.PropTypes[value](
						this._originalSettings[value],
						value,
						this._originalSettings.name || null,
						this._originalSettings.dropletType || null
					)) {
					context[value] = this._originalSettings[value];
				}
			} else {
				throw new Error('Droplet property "' + value + '" definition does not exist.');
			}
		});
	}
};

/**
 * Designed as a PropType validator much like string, isRequired, arrayOf etc, this
 * function specifically tests the validity of the `editable` prop and its children.
 */
Droplet._validateEditableSet = function(value, prop, droplet_name, droplet_type) {
	var attribute, key, attrkey,
		prop_error = 'Error in Droplet prop ' + droplet_name + ' (' + prop + '):';

	// allow undefined values
	if (typeof value === 'undefined') {
		return true;
	}

	// testing the droplet value
	if (PropTypes._assert(
		(typeof value === 'object'), prop, 'Value must be an object.', droplet_name, droplet_type
	)) {
		// continue testing
		for (key in value) {
			// testing individual attributes
			attribute = value[key];

			// attribute is unrecognised or not an object
			if (
				Droplet.editableAttributes.indexOf(key) === -1 ||
				typeof attribute !== 'object'
			) {
				throw new Error(
					prop_error + ' "' + key + '" is not an editable attribute or is of the wrong type'
				);
			}

			// attribute is 'attrs', but is not an object of objects
			if (key === 'attrs') {
				for (attrkey in attribute) {
					Droplet._validateEditableItem(attrkey, attribute[attrkey], prop_error);
				}
			} else {
				Droplet._validateEditableItem(key, attribute, prop_error);
			}
		}
	}

	return true;
};

Droplet._validateEditableItem = function(item, data, error_prefix) {
	var error = error_prefix + item + ' - ';

	if (typeof data !== 'object') {
		throw new Error(error + 'not an EditableItemDefinition object');
	}

	// check "type" exists
	if (typeof data.type === 'undefined') {
		throw new Error(error + 'doesn’t contain ‘type’ value');
	}

	// check "type" is valid
	if (Droplet.editableFieldTypes.indexOf(data.type) === -1) {
		throw new Error(error + 'invalid type attribute "' + data.type + '"');
	}

	// run checks on the editable attributes that match FormField data attributes
	FormField.validateDataAttribute(data, item, error_prefix);

	return true;
};

/**
 * Defines the possible prop types for Droplets. Some are always required.
 * @prop {string} value - Droplet 'value'. When used as an `attribute` type value, can be
 * set to `null` to define a value-less attribute.
 * @prop {string} name - Droplet name (used as a label).
 * @prop {string[]} attachmentIds - Drop zone attachment IDs.
 * @prop {string} dropletType - Droplet type. One of `element`, `text` or `attribute`.
 * @prop {object} [attrs] - Droplet attributes, in the case of the `element` type.
 * @prop {string} tagname - Droplet tagName attribute, i.e. the actual HTMLElement used.
 * Requred when type is `element`.
 * @prop {string} innerHTML - Droplet's innerHTML.
 * @prop {EditableItemDefinition} editable - Editable properties of `element` types. [add link to tutorial!].
 * @prop {string} key - Attribute keys (names) of `attribute` types.
 */
Droplet.PropTypes = {
	value: PropTypes.string.isRequired,
	name: PropTypes.string.notEmpty.isRequired,
	attachmentIds: PropTypes.arrayOf.string.isRequired,
	dropletType: PropTypes.string.isRequired,
	attrs: PropTypes.object,
	tagName: PropTypes.string.notEmpty.isRequired,
	innerHTML: PropTypes.string,
	editable: Droplet._validateEditableSet,
	key: PropTypes.string.notEmpty.isRequired,
	guidance: PropTypes.string
};

Droplet.editableAttributes = [
	'value',	'attrs',	'tagName',	'innerHTML'
];

Droplet.editableFieldTypes = [
	'text',
	'longtext',
	'dropdown',
	'checkbox',
	'radio'
];

export default Droplet;
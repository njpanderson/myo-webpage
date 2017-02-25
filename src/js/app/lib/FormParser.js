var FormParser = function(form) {
	this.form = form;
};

FormParser.prototype = {
	/**
	 * Gets all the values of the form and returns them in a name/value object.
	 * @returns {object} All values of the form.
	 */
	getAllValues: function() {
		values = {};

		this.getUniqueFields().forEach((element) =>
			(values[element.name] = this.getFieldValue(element))
		);

		return values;
	},

	/**
	 * Gets an array of unique fields. The unique-ness of a field is determined by its name.
	 * In the case that more than one field shares the same name, the first field is returned.
	 * @returns {array} All unique fields (by name).
	 */
	getUniqueFields: function() {
		return this.getUniqueItems(true);
	},

	/**
	 * Gets an array of unique field names.
	 * @returns {array} All unique field names.
	 */
	getUniqueNames: function() {
		return this.getUniqueItems();
	},

	/**
	 * Gets an array of unique form items
	 * @param {bool} return_fields - Whether to return the fields themselves (`true`),
	 * or just names (`false`).
	 * @returns {array} All unique items (fields or names).
	 */
	getUniqueItems: function(return_fields) {
		var names = [], fields = [];

		Array.prototype.slice.apply(this.form.elements)
			.forEach((element) => {
				if (element.name && names.indexOf(element.name) === -1) {
					// element has a name and it's not already been added
					names.push(element.name);
					fields.push(element);
				}
			});

		return (return_fields ? fields : names);
	},

	/**
	 * Gets the type of a field, returning one of the {@link FormParser.fieldtypes}
	 * variables.
	 * @returns {string} One of the FormParser.fieldTypes values.
	 */
	getFieldType: function(field) {
		if (field.nodeName === 'INPUT' || field.nodeName === 'TEXTAREA') {
			// inputs and textareas
			if (field.type === 'radio') {
				return FormParser.fieldTypes.RADIO;
			} else if (field.type === 'checkbox') {
				return FormParser.fieldTypes.CHECKBOX;
			} else {
				return FormParser.fieldTypes.TEXT;
			}
		} else if (field.nodeName === 'SELECT') {
			return FormParser.fieldTypes.SELECT;
		}
	},

	/**
	 * Gets the value of a field. In the case of fields with siblings,
	 * an array of values is returned.
	 * @returns {mixed} The field's value. Either as an array or string.
	 */
	getFieldValue: function(field) {
		var type = this.getFieldType(field),
			value = '', a;

		if (type === FormParser.fieldTypes.TEXT && field.value !== '') {
			// basic text fields
			value = field.value;
		} else if (type === FormParser.fieldTypes.CHECKBOX ||
			type === FormParser.fieldTypes.RADIO)  {
			// 'checkable' radios and checkboxes
			value = [];

			this.collectSiblings(field).forEach((field) => {
				if (field.checked) {
					value.push(field.value);
				}
			});
		} else if (type === FormParser.fieldTypes.SELECT &&
			field.selectedIndex > -1) {
			// 'selectable' selects
			if (field.multiple) {
				value = [];

				Array.prototype.slice.apply(field.options).forEach((option) => {
					if (option.selected && option.value !== '') {
						value.push(option.value);
					}
				});
			} else if (field.options[field.selectedIndex].value !== '') {
				value = field.options[field.selectedIndex].value;
			}
		}

		return value;
	},

	/**
	 * Collects the sibling fields with the same name.
	 * @returns {array} All sibling fields with the same name.
	 */
	collectSiblings: function(field) {
		siblings = [];

		for (a = 0; a < this.form.elements.length; a += 1) {
			if (form.elements[a].name === field.name) {
				siblings.push(form.elements[a]);
			}
		}

		return siblings;
	}
};

FormParser.fieldTypes = {
	'TEXT': 'text',
	'TEXTAREA': 'textarea',
	'SELECT': 'select',
	'RADIO': 'radio',
	'CHECKBOX': 'checkbox'
};
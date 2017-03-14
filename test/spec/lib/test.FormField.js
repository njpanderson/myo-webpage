import { expect } from 'chai';

describe('FormField', function() {
	let FormField, test_formfield;

	before(() => {
		FormField = require('../../../src/js/app/lib/FormField').default;
	});

	beforeEach(() => {
		test_formfield = {
			label: 'Test FormField',
			options: ['one', 'two', 'three'],
			value: 'one'
		};
	});

	it('Should instantiate', function() {
		var formfield = new FormField('fieldname', 'text', test_formfield);
		expect(formfield).to.be.an.instanceof(FormField);
	});

	describe('Instantiation sanity checks', function() {
		it('Should throw with an invalid name', function() {
			expect(() => (new FormField())).to.throw(Error, 'Invalid field name');
			expect(() => (new FormField(null))).to.throw(Error, 'Invalid field name');
			expect(() => (new FormField(1))).to.throw(Error, 'Invalid field name');
			expect(() => (new FormField(true))).to.throw(Error, 'Invalid field name');
			expect(() => (new FormField(false))).to.throw(Error, 'Invalid field name');
		});

		it('Should throw with an invalid type', function() {
			expect(() => (new FormField('fieldname', 'foo'))).to.throw(Error, 'Invalid field type');
			expect(() => (new FormField('fieldname', 0))).to.throw(Error, 'Invalid field type');
			expect(() => (new FormField('fieldname', ['text']))).to.throw(Error, 'Invalid field type');
		});
	});

	describe('Data gathering', function() {
		it('Should inherit all valid data object properties', function() {
			var formfield = new FormField('fieldname', 'text', test_formfield);

			expect(formfield.required).to.equal(test_formfield.required);
			expect(formfield.options).to.eql(test_formfield.options);
			expect(formfield.placeholder).to.equal(test_formfield.placeholder);
			expect(formfield.value).to.equal(test_formfield.value);
			expect(formfield.label).to.equal(test_formfield.label);
		});
	});

	describe('Data object checks', function() {
		it('Throws if an field’s "required" attribute isn’t a boolean', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'text',
				required: 'yes'
			}, 'fieldname', 'Test error'))
				.to.throw(Error, '"required" attribute isn’t a boolean true or false');
		});

		it('Accepts if an field’s "required" attribute is a boolean', function() {
			expect(FormField.validateDataAttribute({
				type: 'text',
				required: true
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Throws if an field’s "options" attribute isn’t either an array of strings or an object', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'text',
				options: null
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "options" is of an unrecognised type');
		});

		it('Accepts if an field’s "options" attribute is an array of strings', function() {
			expect(FormField.validateDataAttribute({
				type: 'checkbox',
				options: ['one', 'two', 'three']
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Accepts if an field’s "options" attribute is an object', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				options: { 'one': 'One', 'two': 'Two', 'three': 'Three' }
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Throws if an field’s "value" attribute isn’t either an array of strings, a string, or a number', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'text',
				value: { some: 'value' }
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "value" is of an unrecognised type');
		});

		it('Accepts if an field’s "value" attribute is a string', function() {
			expect(FormField.validateDataAttribute({
				type: 'checkbox',
				value: 'one'
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Accepts if an field’s "value" attribute is a number', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				value: 1
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Accepts if an field’s "value" attribute is an array', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				value: ['one', 'two', 'three']
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Throws if an field’s "value" attribute doesn’t exist within the "options" array', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'dropdown',
				options: ['value1', 'value2', 'value3'],
				value: 'value7'
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "value" attribute contains an option that doesn’t exist');
		});

		it('Throws if an field’s "value" attribute doesn’t exist within a "options" object', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'dropdown',
				options: { 'value1': 'Value 1', 'value2': 'Value 2', 'value3': 'Value 3' },
				value: 'value7'
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "value" attribute contains an option that doesn’t exist');
		});

		it('Accepts if an field’s "value" attribute is a string and exists within a "options" array', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				options: ['value1', 'value2', 'value3'],
				value: 'value2'
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Accepts if an field’s "value" attribute is a string and exists within a "options" object', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				options: { 'value1': 'Value 1', 'value2': 'Value 2', 'value3': 'Value 3' },
				value: 'value3'
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Throws if an field’s "placeholder" attribute isn’t a string', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'text',
				placeholder: ['not', 'a', 'string']
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "placeholder" attribute isn’t a string');
		});

		it('Throws if an field’s "label" attribute isn’t a string', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'dropdown',
				label: ['Test']
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "label" attribute isn’t a string');
		});

		it('Accepts if an field’s "label" attribute is a string', function() {
			expect(FormField.validateDataAttribute({
				type: 'dropdown',
				label: 'Test'
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});

		it('Throws if an field’s "maxlength" attribute isn’t a number above 0', function() {
			expect(() => FormField.validateDataAttribute({
				type: 'text',
				maxlength: ''
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "maxlength" attribute isn’t a number or above zero');

			expect(() => FormField.validateDataAttribute({
				type: 'text',
				maxlength: -1
			}, 'fieldname', 'Test error'))
				.to.throw(Error, 'fieldname - "maxlength" attribute isn’t a number or above zero');
		});

		it('Accepts if an field’s "maxlength" attribute is a number above 0', function() {
			expect(FormField.validateDataAttribute({
				type: 'text',
				maxlength: 1
			}, 'fieldname', 'Test error'))
				.to.be.true;
		});
	});
});
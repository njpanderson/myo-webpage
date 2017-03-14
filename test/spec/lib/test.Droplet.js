import { expect } from 'chai';

describe('Droplet', function() {
	let Droplet, test_droplet, test_element_droplet, test_attribute_droplet;

	before(() => {
		Droplet = require('../../../src/js/app/lib/Droplet').default;
	});

	beforeEach(() => {
		test_droplet = {
			name: 'Test Droplet',
			dropletType: 'text',
			attachmentIds: ['none'],
			value: 'Test value'
		};

		test_element_droplet = {
			name: 'Test element droplet',
			dropletType: 'element',
			attachmentIds: ['none'],
			tagName: 'a',
			attrs: {
				'href': '#'
			},
			innerHTML: 'innerhtml'
		};

		test_attribute_droplet = {
			name: 'Test element droplet',
			dropletType: 'attribute',
			attachmentIds: ['none'],
			key: 'attr_key',
			value: 'attr_value'
		};
	});

	it('Should instantiate', function() {
		var droplet = new Droplet({
			name: 'Test Droplet',
			dropletType: 'text',
			attachmentIds: ['none'],
			value: ''
		}, 0);
		expect(droplet).to.be.an.instanceof(Droplet);
	});

	describe('Instantiation sanity checks', function() {
		it('Should throw with an invalid dropletType', function() {
			test_droplet.dropletType = 'invaliddroplettype';
			expect(() => {
				new Droplet(test_droplet, 0);
			}).to.throw(Error, 'type invaliddroplettype is invalid');
		});
	});

	it('Should inherit basic fields', function() {
		var droplet = new Droplet(test_droplet, 0);
		expect(droplet).to.be.an.instanceof(Droplet);
		expect(droplet.name).to.equal(test_droplet.name);
		expect(droplet.dropletType).to.equal(test_droplet.dropletType);
		expect(droplet.attachmentIds).to.eql(test_droplet.attachmentIds);
		expect(droplet.data.value).to.equal(test_droplet.value);
	});

	describe('#_setExtraFields', function() {
		describe('Type "element"', function() {
			it('Validates and sets extra fields', function() {
				var droplet = new Droplet(test_element_droplet);
				expect(droplet.data.tagName).to.equal(test_element_droplet.tagName);
				expect(droplet.data.attrs).to.eql(test_element_droplet.attrs);
				expect(droplet.data.innerHTML).to.equal(test_element_droplet.innerHTML);
			});
		});

		describe('Type "text"', function() {
			it('Validates and sets extra fields', function() {
				var droplet = new Droplet(test_droplet, 0);
				expect(droplet.data.value).to.equal(test_droplet.value);
			});
		});

		describe('Type "attribute"', function() {
			it('Validates and sets extra fields', function() {
				var droplet = new Droplet(test_attribute_droplet, 0);
				expect(droplet.data.key).to.equal(test_attribute_droplet.key);
				expect(droplet.data.value).to.equal(test_attribute_droplet.value);
			});
		});
	});

	describe('#_validateAndSet', function() {
		it('Throws when attempting to set a non-existent field', function() {
			var droplet = new Droplet(test_droplet, 0);

			expect(() => droplet._validateAndSet(
				['testnonexistentfield'],
				{}
			)).to.throw(Error);
		});
	});

	describe('#_validateEditableSet', function() {
		var prop = 'editable',
			droplet_name = 'Test Droplet',
			droplet_type = 'test';

		//Droplet._validateEditableSet = function(value, prop, droplet_name, droplet_type) {
		it('Throws if the editable prop is not an object', function() {
			expect(() => Droplet._validateEditableSet('', prop, droplet_name, droplet_type))
				.to.throw(Error, 'Value must be an object');
		});

		it('Throws if an editable attribute isn’t the correct type', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: 'invalidtype'
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'is not an editable attribute or is of the wrong type');
		});

		it('Throws if an editable attribute is "attrs" but not an object of attributes', function() {
			expect(() => Droplet._validateEditableSet({
				attrs: {
					type: 'text',
					value: 'test'
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'not an EditableItemDefinition object');
		});

		it('Accepts an editable attribute with the correct type', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'text'
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Accepts an editable "attrs" attribute of the correct type', function() {
			expect(Droplet._validateEditableSet({
				attrs: {
					myattribute: {
						type: 'text'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Throws if an attribute doesn’t have a "type" value', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					value: 'test'
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'doesn’t contain ‘type’ value');
		});

		it('Throws if an attribute’s "type" attribute isn’t recognised', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					type: 'foo'
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'innerHTML - invalid type attribute "foo"');
		});

		it('Accepts an attribute’s recognised "type" attribute', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'longtext'
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});
	});

	describe('#_validateEditableSet - FormField attributes', function() {
		var prop = 'editable',
			droplet_name = 'Test Droplet',
			droplet_type = 'test';

		it('Throws if an item’s "required" attribute isn’t a boolean', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					type: 'text',
					required: 'yes'
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, '"required" attribute isn’t a boolean true or false');
		});

		it('Accepts if an item’s "required" attribute is a boolean', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'text',
					required: true
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Throws if an item’s "options" attribute isn’t either an array of strings or an object', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					type: 'text',
					options: null
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'innerHTML - "options" is of an unrecognised type');
		});

		it('Accepts if an item’s "options" attribute is an array of strings', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'checkbox',
					options: ['one', 'two', 'three']
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Accepts if an item’s "options" attribute is an object', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'dropdown',
					options: { 'one': 'One', 'two': 'Two', 'three': 'Three' }
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Throws if an item’s "value" attribute isn’t either an array of strings, a string, or a number', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					type: 'text',
					value: { some: 'value' }
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, 'innerHTML - "value" is of an unrecognised type');
		});

		it('Accepts if an item’s "value" attribute is a string', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'checkbox',
					value: 'one'
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Accepts if an item’s "value" attribute is a number', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'dropdown',
					value: 1
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Accepts if an item’s "value" attribute is an array', function() {
			expect(Droplet._validateEditableSet({
				innerHTML: {
					type: 'dropdown',
					value: ['one', 'two', 'three']
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Throws if an item’s "value" attribute doesn’t exist within the "options" array', function() {
			expect(() => Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						options: ['value1', 'value2', 'value3'],
						value: 'value7'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, '"value" attribute contains an option that doesn’t exist');
		});

		it('Throws if an item’s "value" attribute doesn’t exist within a "options" object', function() {
			expect(() => Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						options: { 'value1': 'Value 1', 'value2': 'Value 2', 'value3': 'Value 3' },
						value: 'value7'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, '"value" attribute contains an option that doesn’t exist');
		});

		it('Accepts if an item’s "value" attribute is a string and exists within a "options" array', function() {
			expect(Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						options: ['value1', 'value2', 'value3'],
						value: 'value2'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Accepts if an item’s "value" attribute is a string and exists within a "options" object', function() {
			expect(Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						options: { 'value1': 'Value 1', 'value2': 'Value 2', 'value3': 'Value 3' },
						value: 'value3'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});

		it('Throws if an item’s "placeholder" attribute isn’t a string', function() {
			expect(() => Droplet._validateEditableSet({
				innerHTML: {
					type: 'text',
					placeholder: ['not', 'a', 'string']
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, '"placeholder" attribute isn’t a string');
		});

		it('Throws if an item’s "label" attribute isn’t a string', function() {
			expect(() => Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						label: ['Test']
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.throw(Error, '"label" attribute isn’t a string');
		});

		it('Accepts if an item’s "label" attribute is a string', function() {
			expect(Droplet._validateEditableSet({
				attrs: {
					'data-test': {
						type: 'dropdown',
						label: 'Test'
					}
				}
			}, prop, droplet_name, droplet_type))
				.to.be.true;
		});
	});
});
import { expect } from 'chai';

describe('FormParser', function() {
	let FormParser;

	before(() => {
		FormParser = require('../../../src/js/app/lib/FormParser').default;
	});

	it('Should instantiate', function() {
		var form = new FormParser();
		expect(form).to.be.an.instanceof(FormParser);
	});

	describe('#getAllValues', function() {
		it('Should get all the values of the form (at defaults)');
		it('Should get all the values of the form (filled in)');
	});

	describe('#getUniqueFields', function() {
		it('Should get all uniquely named fields, with no duplicate fields of the same name');
	});

	describe('#getUniqueNames', function() {
		it('Should get all unique field names');
	});

	describe('#getFieldType', function() {
		it('Correctly identifies text fields');
		it('Correctly identifies radio fields');
		it('Correctly identifies checkbox fields');
		it('Correctly identifies select fields');
	});

	describe('#getFieldValue', function() {
		it('Retrieves the value of text fields');
		it('Retrieves the value(s) of radio fields');
		it('Retrieves the value(s) of checkbox fields');
		it('Retrieves the value(s) of single select fields');
		it('Retrieves the value(s) of multiple select fields');
	});

	describe('#collectSiblings', function() {
		it('Gets the siblings of a radio field');
		it('Gets the siblings of a checkbox field');
	});

});
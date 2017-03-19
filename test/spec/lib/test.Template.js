import { expect } from 'chai';

describe('Template', function() {
	var Template;

	before(() => {
		Template = require('../../../src/lib/Template').default;
	});

	it('Should instantiate', function() {
		var template = new Template();
		expect(template).to.be.an.instanceof(Template);
	});

	describe('#load', function() {
		it('Should load a URL');
		it('Should throw with an invalid URL');
	});

	describe('#create', function() {
		it('Should create drop zones within the defined markup');
		it('Should throw if maximum number of drop zones were reached');
	});

	describe('#getDropZoneById', function() {
		it('Should return a drop zone by its ID');
	});
});
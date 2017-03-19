import { expect } from 'chai';

describe('utils', function() {
	var utils;

	before(() => {
		utils = require('../../../src/lib/utils');
	});

	describe('registerGeneralEvent', function() {
		it('(use pending)');
	});

	describe('collectRef', function() {
		it('Should invoke refCollector within props object');
		it('Should throw when props object does not contain refCollector');
	});

	describe('validatePropKeys', function() {
		it('(use pending)');
		// it('Validates a prop with the required keys');
		// it('Return an error on a prop without the required keys');
	});

	describe('escapeRegExp', function() {
		it('Correctly escapes a string');
	});
});
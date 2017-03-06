import { expect } from 'chai';

import useMockery from '../helpers/mockery';

describe('View', function() {
	let View;

	useMockery(() => {
		useMockery
			.registerMultiple({
				'./lib/Communicator': require('../mocks/Communicator')
			});
	});

	before(() => {
		View = require('../../src/js/app/View').default;
	});

	it('Should instantiate', function() {
		var view = new View();
		expect(view).to.be.an.instanceof(View);
	});

	describe('#_handleAppMessage', function() {
		it('Handles app message to reload');
	});
});
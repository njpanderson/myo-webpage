import { expect } from 'chai';

import useMockery from '../../helpers/mockery';

describe('DragDrop', function() {
	let DragDrop;

	useMockery(() => {
		useMockery
			.registerMultiple({
				'interact.js': require('../../mocks/node/interact')
			});
	});

	before(() => {
		DragDrop = require('../../../src/lib/DragDrop').default;
	});

	it('Should instantiate', function() {
		var dragdrop = new DragDrop();
		expect(dragdrop).to.be.an.instanceof(DragDrop);
	});

	describe('#addDragable', function() {
		it('Adds a draggable element');
	});

	describe('#addDropable', function() {
		it('Adds a drop zone element');
	});

	describe('#resetDragPosition', function() {
		it('Resets the position of an element');
	});

	describe('#getDragInstance', function() {
		it('Gets the Dragable class instance for element');
	});

	describe('#_createInstance', function() {
		it('Returns an object containing the arguments');
	});


});
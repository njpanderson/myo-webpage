import { expect } from 'chai';

import useMockery from '../helpers/mockery';
import genericMockedModule from '../helpers/genericMockedModule';
import MockIndex from '../mocks/Index';

describe('UI', function() {
	let UI, index;

	useMockery(() => {
		var Communicator, DragDrop;

		Communicator = genericMockedModule({
			registerGuestAddress: null,
			send: null
		});

		DragDrop = genericMockedModule();

		useMockery
			.registerMultiple({
				'./DragDrop': DragDrop,
				'./Communicator': Communicator,
				'../components/containers/CanvasContainer': require('../mocks/views/GenericComponent'),
				'../components/views/Icon.jsx': require('../mocks/views/Icon')
			});
	});

	before(() => {
		UI = require('../../src/lib/UI').default;
	});

	beforeEach(() => {
		index = new MockIndex();
	});

	it('Should instantiate', function() {
		var ui = new UI(
			index,
			require('../fixtures/defaults.js').default,
			{},
			{},
			{
				_data: {}
			},
			require('../mocks/Template')
		);
		expect(ui).to.be.an.instanceof(UI);
	});

	describe('#render', function() {
		it('Sends render request to the Canvas');
	});

	describe('#_showDialog', function() {
		it('Shows a dialog via store');
	});

	describe('#_completeDialogAction', function() {
		it('Completes action for dialogModes.EDIT_DROPLET');
	});

	describe('#_refCollector', function() {
		it('Collects a keyed ref within a collection');
		it('Collects an un-keyed ref within a collection');
		it('Throws if `element` is null');
	});

	describe('#_mountEvent', function() {
		it('Captures canvas mount event');
		it('Captures template mount event');
		it('Captures droplet mount event');
		it('Captures view_frame mount event');
		it('Throws with an invalid ref');
		it('Dispatches activation with canvas, template and view_frame mounted');
	});

	describe('#_queueDragDropBinding', function() {
		it('Immediately binds a DragDrop when the canvas ref exists');
		it('Queues a DragDrop binding before the canvas ref exists');
	});

	describe('#_setDragDropBindings', function() {
		it('Sets drag bindings for a given queue');
		it('Sets drop bindings for a given queue');
	});

	describe('#_handleDropletDrop', function() {
		it('Shows dialog via store with a valid Droplet');
		it('Returns false with an invalid Droplet');
	});

	describe('#_isValidDrop', function() {
		it('Returns true for valid drops');
		it('Returns false for invalid drops');
	});

	describe('#_updateView', function() {
		// TODO
	});

	describe('#_getReferencedElement', function() {
		it('Gets a referenced keyed element');
		it('Gets a referenced un-keyed element');
	});

	describe('#getDropletById', function() {
		it('Gets a Droplet instance by its `id` property');
	});
});
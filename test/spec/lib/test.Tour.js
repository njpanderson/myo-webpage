import { expect } from 'chai';

import { dialogModes, actionTypes } from '../../../src/assets/constants';
import createDialogs from '../../../src/assets/dialogs';
import defaults from '../../fixtures/default';
import MockUI from '../../mocks/UI';

describe('Tour', function() {
	var stats = {}, dialogs,
		Tour, ui;

	before(() => {
		Tour = require('../../../src/lib/Tour').default;
		dialogs = createDialogs(defaults);
	});

	beforeEach(() => {
		ui = new MockUI();

		// stats is defined as an object above so it is passed to the mock UI by reference
		// its values are then reset before each test
		stats._showDialog = [];
		stats._hideDialog = 0;
		stats.dispatches = [];

		ui.__set_test_stats(stats);
	});

	afterEach(() => {
		ui = null;
	});

	it('Should instantiate', function() {
		var tour = new Tour(ui);
		expect(tour).to.be.an.instanceof(Tour);
	});

	describe('#intro', function() {
		it('Should show an intro', function() {
			ui.__set_showDialog_resolver(function(resolve) {
				resolve();
			});

			var tour = new Tour(ui);

			return tour.intro()
				.then(() => {
					expect(ui.__test_stats._showDialog[0].mode).to.equal(dialogModes.GENERAL);
					expect(ui.__test_stats._showDialog[0].data).to.eql(dialogs.intro);
					expect(ui.__test_stats._hideDialog).to.equal(1);
				});
		});
	});

	describe('start', function() {
		it('Should start the tour', function() {
			ui.__set_showDialog_resolver(function(resolve) {
				// pause the tour so only the first dialog is shown
				resolve({
					action: 'pause'
				});
			});

			var tour = new Tour(ui);

			return tour.start()
				.then(() => {
					expect(stats._showDialog[0].mode).to.equal(dialogModes.TOUR);
					expect(stats._showDialog[0].data).to.eql(dialogs.tour[0]);
					expect(stats._showDialog).to.have.lengthOf(1);
				});
		});
	});

	describe('_setTourStage', function() {
		it('Should set the tour stage to 1', function() {
			var tour = new Tour(ui);
			tour._setTourStage(1);

			expect(stats.dispatches[0]).to.eql({
				type: actionTypes.SET_TOUR_STAGE,
				stage: 1
			});
		});

		it('Should only set the tour stage once', function() {
			var tour = new Tour(ui);
			tour._setTourStage(1);

			expect(stats.dispatches).to.have.lengthOf(1);
		});
	});
});
import { expect } from 'chai';

import { messageCommands } from '../../src/assets/constants';

import useMockery from '../helpers/mockery';
import genericMockedModule from '../helpers/genericMockedModule';

describe('View', function() {
	var View, Communicator, view, mock_send_id_count;

	useMockery(() => {
		Communicator = genericMockedModule({
			registerGuestAddress: null,
			send: () => {
				return 'mock-id-' + mock_send_id_count++;
			}
		});

		useMockery
			.registerMultiple({
				'./lib/Communicator': Communicator
			});
	});

	before(() => {
		View = require('../../src/View').default;
	});

	beforeEach(() => {
		view = new View({
			container: document.createElement('DIV')
		});

		Communicator.__clearInvocations();
		mock_send_id_count = 0;
	});

	describe('#dialog', function() {
		it('Produces a dialog', () => {
			var args,
				fn_after = function() {},
				dialog = [
					'Dialog Title',
					'Dialog Message',
					['buttondata'],
					fn_after
				];


			view.dialog.apply(view, dialog);
			args = Communicator.__getInvocation('send', 0);

			expect(view._callbacks['mock-id-0']).to.equal(fn_after);
			expect(args[1].data.title).to.equal(dialog[0]);
			expect(args[1].data.message).to.equal(dialog[1]);
			expect(args[1].data.buttons).to.eql(dialog[2]);
		});
	});

	describe('#_handleAppMessage', function() {
		it('Handles RELOAD command', () => {
			view._handleAppMessage({
				cmd: messageCommands.RELOAD,
				data: {
					markup: 'test'
				}
			});

			expect(view.settings.container.innerHTML).to.equal('test');
		});

		it('Handles RESET command', () => {
			view.settings.container.innerHTML = 'testing';

			view._handleAppMessage({
				cmd: messageCommands.RESET
			});

			expect(view.settings.container.innerHTML).to.be.empty;
		});
	});
});
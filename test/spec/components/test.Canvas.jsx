import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import useMockery from '../../helpers/mockery';

import defaults from '../../fixtures/defaults';
import { uiStates } from '../../../src/assets/constants';

describe('Canvas', function() {
	let Canvas;

	useMockery(() => {
		useMockery
			.registerMultiple({
				'../views/View.jsx': require('../../mocks/views/GenericComponent.js'),
				'../views/Header.jsx': require('../../mocks/views/GenericComponent.js'),
				'./TemplateContainer': require('../../mocks/views/GenericComponent.js'),
				'./DialogContainer': require('../../mocks/views/GenericComponent.js'),
				'./PalletContainer': require('../../mocks/views/GenericComponent.js')
			});
	});

	const renderer = ReactTestUtils.createRenderer(),
		state = {
			ui_state: uiStates.INITIALISING
		},
		data = {
			template: null
		},
		noop = () => {},
		props_std = {
			refCollector: noop,
			onMount: noop,
			onDialogComplete: noop,
			onDialogCancel: noop,
			onAttachmentClick: noop,
			onDropletEvent: noop,
			onDropZoneEvent: noop,
			onDragHandlePress: noop,
			onButtonClick: noop,
			lib: {}
		};

	before(() => {
		Canvas = require('../../../src/components/containers/Canvas').default;
	});

	it('Should render to page', function() {
		renderer.render(
			<Canvas {...props_std}
				settings={defaults}
				state={state}
				data={data}/>
		);

		expect(renderer.getRenderOutput().type).to.equal('div');
	});

	it('Should accumulate classname for initial state', function() {
		renderer.render(
			<Canvas {...props_std}
				settings={defaults}
				state={state}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas initialising');
	});

	it('Should accumulate classname for active state', function() {
		renderer.render(
			<Canvas {...props_std}
				settings={defaults}
				state={Object.deepAssign({}, state, {
					active: true,
					ui_state: uiStates.ACTIVE
				})}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas active');
	});
});
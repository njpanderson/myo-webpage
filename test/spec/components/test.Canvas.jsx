import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import defaults from '../../../src/js/app/assets/defaults';
import { uiStates } from '../../../src/js/app/assets/constants';

describe('Canvas', function() {
	var Canvas;

	const renderer = ReactTestUtils.createRenderer(),
		state = {
			ui_state: uiStates.INITIALISING
		},
		data = {
			template: null
		},
		noop = () => {};

	before(() => {
		Canvas = require('../../../src/js/app/components/containers/Canvas').default;
	});

	it('Should render to page', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={state}
				refCollector={noop}
				onMount={noop}
				onDialogComplete={noop}
				onDialogCancel={noop}
				onAttachmentClick={noop}
				class_ui={{}}
				class_template={{}}
				data={data}/>
		);

		expect(renderer.getRenderOutput().type).to.equal('div');
	});

	it('Should accumulate classname for initial state', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={state}
				refCollector={noop}
				onMount={noop}
				onDialogComplete={noop}
				onDialogCancel={noop}
				onAttachmentClick={noop}
				class_ui={{}}
				class_template={{}}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas initialising');
	});

	it('Should accumulate classname for active state', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={Object.deepAssign({}, state, {
					active: true,
					ui_state: uiStates.ACTIVE
				})}
				refCollector={noop}
				onMount={noop}
				onDialogComplete={noop}
				onDialogCancel={noop}
				onAttachmentClick={noop}
				class_ui={{}}
				class_template={{}}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas active');
	});
});
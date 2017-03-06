import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

import defaults from '../../../src/js/app/assets/defaults';
import { uiStates } from '../../../src/js/app/assets/constants';

describe('Canvas', function() {
	var Canvas;

	const renderer = ReactTestUtils.createRenderer(),
		state = {
			app: {
				ui_state: uiStates.INITIALISING
			}
		},
		data = {
			template: null
		},
		refCollector = () => {};

	before(() => {
		Canvas = require('../../../src/js/app/components/Canvas').default;
	});

	it('Should render to page', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={state}
				refCollector={refCollector}
				data={data}/>
		);

		expect(renderer.getRenderOutput().type).to.equal('div');
	});

	it('Should accumulate classname for initial state', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={state}
				refCollector={refCollector}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas initialising');
	});

	it('Should accumulate classname for active state', function() {
		renderer.render(
			<Canvas
				settings={defaults}
				state={Object.deepAssign({}, state, {
					app: {
						active: true,
						ui_state: uiStates.BUILDING
					}
				})}
				refCollector={refCollector}
				data={data}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas building active');
	});
});
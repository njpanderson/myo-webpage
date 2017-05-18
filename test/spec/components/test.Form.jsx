import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { expect } from 'chai';

import useMockery from '../../helpers/mockery';
import defaults from '../../fixtures/defaults';

describe('Form', function() {
	var Form;

	useMockery(() => {
		useMockery
			.registerMultiple({
				'./Fieldset.jsx': require('../../mocks/views/GenericComponent.js'),
				'./Button.jsx': require('../../mocks/views/GenericComponent.js')
			});
	});

	const renderer = createRenderer(),
		fieldSets = [{
			key: 'test_fieldset1',
			fields: []
		}, {
			key: 'test_fieldset2',
			fields: []
		}],
		noop = (() => {});

	before(() => {
		Form = require('../../../src/components/views/Form').default;
	});

	it('Should render to page', function() {
		renderer.render(
			<Form
				fieldSets={fieldSets}
				settings={defaults}
				lib={{}}/>
		);

		expect(renderer.getRenderOutput().type).to.equal('form');
	});

	it('Should create fields from object'/*, function() {
		var fields = {

		};

		renderer.render(
			<Form
				fields={fields}/>
		);

		expect(renderer.getRenderOutput().props.className).to.equal('tag-canvas initialising');
	}*/);
});
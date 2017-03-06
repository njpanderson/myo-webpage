import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { expect } from 'chai';

describe('Form', function() {
	var Form;

	const renderer = ReactTestUtils.createRenderer();

	before(() => {
		Form = require('../../../src/js/app/components/Form').default;
	});

	it('Should render to page', function() {
		renderer.render(
			<Form/>
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
import React from 'react';
// import { createRenderer } from 'react-test-renderer/shallow';
import { mount } from 'enzyme';
import { expect } from 'chai';

import counter from '../../helpers/counter';
import FormField from '../../../src/lib/FormField';

describe('TextField', function() {
	var TextField, props;

	before(() => {
		TextField = require('../../../src/components/views/fields/TextField.jsx').default;
	});

	beforeEach(() => {
		props = {
			field: new FormField('textfield', 'text', {
				label: 'TextField'
			}),
			value: 'item2',
			className: ['class1', 'class2'],
			onChange: counter('textField-onChange')
		};
	});

	afterEach(() => {
		counter.resetAll();
	});

	it('Should contain the correct classes', function() {
		const wrapper = mount(
				<TextField
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		props.className.forEach((className) =>
			expect(wrapper.find('div').hasClass(className)).to.equal(true)
		);
	});

	it('Should have the correct label', function() {
		const wrapper = mount(
				<TextField
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		expect(wrapper.find('label').text()).to.equal(props.field.label);
	});

	it('Should have the correct value', function() {
		const wrapper = mount(
				<TextField
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		expect(wrapper.find({ value: props.value })).to.have.length(1);
	});

	it('Should trigger the onChange handler once', function() {
		const wrapper = mount(
				<TextField
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		wrapper.find('input').simulate('change');
		expect(counter('textField-onChange')).to.equal(1);
	});
});
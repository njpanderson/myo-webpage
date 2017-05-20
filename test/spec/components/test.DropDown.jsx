import React from 'react';
// import { createRenderer } from 'react-test-renderer/shallow';
import { mount } from 'enzyme';
import { expect } from 'chai';

import counter from '../../helpers/counter';
import FormField from '../../../src/lib/FormField';

describe('DropDown', function() {
	var DropDown, props;

	before(() => {
		DropDown = require('../../../src/components/views/fields/DropDown.jsx').default;
	});

	beforeEach(() => {
		props = {
			field: new FormField('dropdown', 'dropdown', {
				label: 'Dropdown',
				options: [
					'item1',
					'item2',
					'item3'
				]
			}),
			value: 'item2',
			className: ['class1', 'class2'],
			onChange: counter('dropDown-onChange')
		};
	});

	afterEach(() => {
		counter.resetAll();
	});

	it('Should contain the correct classes', function() {
		const wrapper = mount(
				<DropDown
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
				<DropDown
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		expect(wrapper.find('label').text()).to.equal(props.field.label);
	});

	it('Should have the correct options', function() {
		const wrapper = mount(
				<DropDown
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		expect(wrapper.find('option')).to.have.length(props.field.options.length);
		expect(wrapper.find('option').at(0).text()).to.equal(props.field.options[0]);
	});

	it('Should trigger the onChange handler once', function() {
		const wrapper = mount(
				<DropDown
					field={props.field}
					value={props.value}
					className={props.className}
					onChange={props.onChange}/>
			);

		wrapper.find('select').simulate('change');
		expect(counter('dropDown-onChange')).to.equal(1);
	});
});
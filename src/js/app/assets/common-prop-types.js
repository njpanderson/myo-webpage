import { PropTypes } from 'react';

import FormField from '../lib/FormField';

export const components = {
	data: PropTypes.object,
	state: PropTypes.object,
	classes: PropTypes.object,
	onMount: PropTypes.func,
	refCollector: PropTypes.func
};

export const field = {
	field: PropTypes.instanceOf(FormField).isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.string)
	]).isRequired,
	onChange: PropTypes.func
};
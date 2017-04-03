import { PropTypes } from 'react';

import FormField from '../lib/FormField';

export const field = {
	refCollector: PropTypes.func,
	field: PropTypes.instanceOf(FormField).isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.arrayOf(PropTypes.string)
	]).isRequired,
	onChange: PropTypes.func
};
import { expect } from 'chai';

/**
 * @description
 * Provides loose shallow comparison of the structure of two objects.
 * Excludes functions.
 * @param {object} test - Test object
 * @param {object} expected - Expected result
 */
export default function structCompare(test, expected) {
	var key, item;

	if (typeof test !== 'object') {
		throw new Error('test is not a object.');
	}

	if (typeof expected !== 'object') {
		throw new Error('expected is not an object.');
	}

	function structCompareArray(array, expected) {
		// test array keys one at a time
		item.forEach((e, i) => {
			// array key is an object
			if (typeof e === 'object') {
				if (Array.isArray(e)) {
					structCompareArray(e, expected[i]);
				} else {
					structCompare(e, expected[i]);
				}
			} else{
				expect(e).to.equal(expected[i]);
			}
		});
	}

	for (key in test) {
		if (test.hasOwnProperty(key)) {
			item = test[key];

			if (typeof item === 'object') {
				if (Array.isArray(item)) {
					structCompareArray(item, expected[key]);
				} else {
					structCompare(item, expected[key]);
				}
			} else if (typeof item !== 'function') {
				expect(item).to.equal(expected[key]);
			}
		}
	}
}
var counters = {};

/**
 * Either returns a counter function or retrieves the count/value of a counter.
 * @param {string} id - Counter ID, either for setting or retrieval.
 * @param {number} index - Logged arguments index.
 * @description
 * On first run, if an ID does not exist within the counters, a counting function will
 * be returned. This function, when invoked. will populate the counter with the function's arguments.
 *
 * If called with an `id` property after the first invokation, will return the number of times
 * the counting function has been used. If called with a `index` as well as an `id`, will return
 * the arguments for that specific invocation index.
 * @example
 * // initialise the counter with id 'test'
 * var mycounter = counter('test');
 * // run the counter a couple of times
 * mycounter({ foo: 'bar' });
 * mycounter({ foo: 'baz' });
 * // retrieve length of counter with id 'test'
 * console.log(counter('test')); // > 2
 * // get arguments for specific invokation index
 * console.log(counter('test', 1)); // > { foo: 'baz' }
 * // reset the counters
 * counter.resetAll();
 */
function counter(id, index) {
	if (!(id in counters)) {
		counters[id] = [];

		return function() {
			counters[id].push([...arguments]);
		};
	} else {
		return (typeof index !== 'undefined' ? counters[id][index] : counters[id].length);
	}
}

/**
 * @description
 * Resets all counters. New invokations of counter with previously used IDs will create
 * new counters starting from zero.
 */
counter.resetAll = function() {
	counters = {};
};

export default counter;
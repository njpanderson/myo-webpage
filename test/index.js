/* eslint no-debugger: "off" */
const glob = require('glob'),
	jsdom = require('./fixtures/dom');

global.PRODUCTION = false;

require('../src/lib/polyfills');

jsdom('test/fixtures/index.html', (document) => {
	global.canvas = document.querySelector('.app');

	beforeEach('all', function() {
		// enforce re-setting of whatever app/component is being tested
		global.canvas.innerHTML = '';
	});

	describe('Tag test suite', function() {
		// debugger pause and allow unlimited timings if node env is test-live
		if (process.env.NODE_ENV === 'test-live') {
			this.timeout(0);

			// break here so breakpoints can be made (--debug-brk breakpoint in mocha is too early!)
			debugger;
		}

		// require individual test specs
		glob.sync('./spec/**/test.*.js*', {
			cwd: './test'
		}).map(require);
	});
});
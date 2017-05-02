import path from 'path';
import fs from 'fs';
import { jsdom } from 'jsdom';

module.exports = function(filename, finish) {
	var markup = fs.readFileSync(path.resolve(filename));

	// create a document instance and the usual globals
	global.document = jsdom(markup || '');
	global.window = document.defaultView;
	global.navigator = window.navigator;

	if (typeof finish === 'function') {
		// fire the callback, sending it the above variables
		finish.apply(this, [document, window, navigator]);
	}
};
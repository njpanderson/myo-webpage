import path from 'path';
import fs from 'fs';
import { jsdom } from 'jsdom';

module.exports = function(filename, finish) {
	var markup = fs.readFileSync(path.resolve(filename));

	global.document = jsdom(markup || '');
	global.window = document.defaultView;
	global.navigator = window.navigator;

	if (typeof finish === 'function') {
		finish.apply(this, [document, window, navigator]);
	}
};
import fs from 'fs';

var Template = function() {

};

Template.prototype = {
	load: function(url) {
		if (fs.existsSync(url)) {
			return Promise.resolve(
				fs.readFileSync(url, {
					encoding: 'UTF-8'
				})
			);
		} else {
			return Promise.reject(
				new Error('404 File not found')
			);
		}
	},

	create: function() {
		return fs.readFileSync('test/fixtures/template-with-drop-zones.html', {
			encoding: 'UTF-8'
		});
	}
};

export default Template;
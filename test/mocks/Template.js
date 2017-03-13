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
		return {
			template: [],
			drop_zones: {}
		};
	}
};

export default Template;
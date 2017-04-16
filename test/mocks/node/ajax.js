import fs from 'fs';

export default {
	get: function(path) {
		if (fs.existsSync(path)) {
			return Promise.resolve({
				text: fs.readFileSync(path, {
					encoding: 'UTF-8'
				})
			});
		} else {
			return Promise.reject(
				new Error('404 File not found')
			);
		}
	}
};
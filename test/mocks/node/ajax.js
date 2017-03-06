import fs from 'fs';

export default {
	get: function(url) {
		if (url === 'testpallet.json') {
			return Promise.resolve({
				text: fs.readFileSync('test/fixtures/pallet.json', {
					encoding: 'UTF-8'
				})
			});
		} else if (url === 'corrupted.json') {
			return Promise.resolve({
				text: fs.readFileSync('test/fixtures/corrupted.json', {
					encoding: 'UTF-8'
				})
			});
		} else if (url === 'empty.json') {
			return Promise.resolve({
				text: fs.readFileSync('test/fixtures/empty.json', {
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
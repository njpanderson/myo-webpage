import App from '../Index';

var app = new App({
	onElementRender: function(markup, droplet, zone, is_output) {
		if (droplet.name === 'Letter button' && is_output) {
			markup.innerHTML = '<span>' + markup.innerHTML + '</span>';
		}

		return markup;
	}
});

app.load(
	'templates/default.html',
	'templates/pallet.json'
).then(() => {
	app.dialog('Test dialog', ['This is a test'])
		.then(() => {
			console.log('complete 1');
		})
		.then(() => {
			return app.dialog('Test dialog 2', ['This is a test']);
		})
		.then(() => {
			console.log('complete 2');
		})
		.catch(() => {
			console.log('cancel');
		});
}).catch((error) => {
	console.error(error);
	throw error;
});
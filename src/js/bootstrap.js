require.ensure([], () => {
	const App = require('./app/Index').default;

	var app = new App();

	app.load(
		'templates/default.html',
		'templates/pallet.json'
	);
}, 'app');
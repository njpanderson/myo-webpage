require.ensure([], () => {
	const App = require('./app/Index.jsx').default;

	var app = new App();

	app.load(
		'templates/default.html',
		'templates/pallet.json'
	);
}, 'app');
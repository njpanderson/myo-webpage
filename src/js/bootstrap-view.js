require.ensure([], () => {
	const View = require('./app/View').default;

	new View();
}, 'view');
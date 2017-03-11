require.ensure([], () => {
	const View = require('./app/View').default;

	new View({
		container: document.querySelector('.view')
	});
}, 'view');
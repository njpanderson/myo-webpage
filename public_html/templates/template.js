(function(view) {
	document.querySelector('button#general-alert').addEventListener('click', function() {
		view.dialog(
			'Test Dialog',
			[
				'This is a test dialog'
			],
			[{
				type: 'cancel',
				label: 'Cancel'
			}, {
				type: 'submit',
				label: 'OK'
			}, {
				type: 'foobar',
				label: 'Custom Button',
				data: {
					mycustomvalue: 42
				}
			}],
			function(data, action, action_data) {
				console.log('message finish');
				console.log('data', data);
				console.log('action', action);
				console.log('action_data', action_data);
			}
		);
	});
}(window.view));
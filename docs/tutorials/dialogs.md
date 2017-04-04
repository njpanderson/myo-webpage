# Dialogs

This is a work in progress tutorial about invoking dialogs.

```
app.dialog('Test', 'Message', [{
	type: 'cancel',
	label: 'Cancel'
}, {
	type: 'custom_type',
	label: 'Custom',
	data: { 'action': 'data' }
}, {
	type: 'submit',
	label: 'OK'
}])
	.then((data, action, action_data) => {
		// perform any actions here...
		app.hideDialog();
	})
	.catch(app.hideDialog);
```
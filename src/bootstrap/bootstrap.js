import App from '../Index';

const app = new App({
	onElementRender: function(markup, droplet, zone, is_output) {
		if (droplet.name === 'Letter button' && is_output) {
			markup.innerHTML = '<span>' + markup.innerHTML + '</span>';
		}

		return markup;
	}
});

const pallet = [
	{
		'name': 'Header',
		'dropletType': 'text',
		'value': 'Page header',
		'attachmentIds': ['h1'],
		'editable': {
			'value': {
				'type': 'text',
				'label': 'Header label',
				'value': 'Page header',
				'required': true
			}
		},
		'guidance': '<p>(Guidance text for header)</p>'
	},
	{
		'name': 'Section class',
		'dropletType': 'attribute',
		'key': 'class',
		'value': 'board',
		'attachmentIds': ['section_class'],
		'guidance': '<p>(Guidance text for class)</p>'
	},
	{
		'name': 'Link',
		'dropletType': 'element',
		'innerHTML': '',
		'tagName': 'a',
		'attrs': {
			'href': '#',
			'class': 'blue'
		},
		'attachmentIds': ['button'],
		'editable': {
			'attrs': {
				'class': {
					'type': 'dropdown',
					'required': true,
					'label': 'Choose a colour',
					'options': ['blue', 'red', 'green'],
					'value': 'blue'
				}
			},
			'innerHTML': {
				'type': 'text',
				'required': function(values) {
					var value = values.innerHTML.innerHTML;

					if (value === '') {
						return 'This value is required.';
					} else if (!/^[a-z]+$/i.test(value)) {
						return 'This value can only be alphabet letters from A-Z.';
					} else {
						return true;
					}
				},
				'label': 'Set innerHTML'
			}
		},
		'guidance': '<p>(Guidance text for link)</p>'
	}
];

app.load(
	'templates/default.html',
	pallet
)
	.catch((error) => {
		console.error(error);
	});
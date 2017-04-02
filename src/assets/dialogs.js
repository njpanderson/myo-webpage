const tourDialogModifiers = {
	arrow: {
		element: '.arrow'
	}
};

export default {
	intro: {
		title: 'Welcome to <span class="logo">&lt;<b>Tag</b>&gt;</span>!',
		message: [
			'Tag is an app designed to explain how web pages are constructed.',
			'If you are new to tag, you can use the Tour button in the toolbar.',
			'Otherwise, just click “OK” and get creating!'
		]
	},
	tour: [{
		title: 'Welcome to <span class="logo">&lt;<b>Tag</b>&gt;</span>!',
		message: [
			'Tag is an app designed to explain how web pages are constructed.',
			'The idea is simple: Place <b>elements</b> onto the <b>template</b>, and then use the ' +
				'<span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#icon-media-play"></use></svg>Run</span> button to see how the page will look ' +
				'in the <b>view</b>.'
		]
	}, {
		title: 'The template',
		message: [
			'This is the template. It contains the source code for your web page, and is where you’ll add snippets of code.',
			'Add elements to the blue targets (<span class="drop-zone"><span class="target"><b>...</b></span></span>) to construct the page.'
		],
		overlay: false,
		attachment: {
			selector: '.main > .template',
			options: {
				placement: 'right',
				modifiers: tourDialogModifiers
			}
		}
	}, {
		title: 'The pallet',
		message: [
			'This is the pallet. It contains elements, which can be added to the template above.',
			'Click on an element and then click on one of the blue targets in the template to attach it.'
		],
		overlay: false,
		attachment: {
			selector: 'section.pallet',
			options: {
				placement: 'top',
				modifiers: tourDialogModifiers
			}
		}
	}, {
		title: 'The view',
		message: [
			'This is the view. It will show you how the page looks after running the code!',
			'Use the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#icon-media-play"></use></svg>Run</span> button to update the view'
		],
		overlay: false,
		attachment: {
			selector: 'section.view',
			options: {
				placement: 'left',
				modifiers: tourDialogModifiers
			}
		}
	}]
};
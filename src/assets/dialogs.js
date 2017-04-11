const tourDialogModifiers = {
	arrow: {
		element: '.arrow'
	}
};

const tourButtons = {
	proceed: [{
		type: 'cancel',
		label: 'Close'
	}, {
		type: 'submit',
		label: 'Continue'
	}],
	try_it: [{
		type: 'cancel',
		label: 'Close'
	}, {
		type: 'pause',
		label: 'Try it out'
	}, {
		type: 'submit',
		label: 'Continue'
	}],
	end: [{
		type: 'submit',
		label: 'Finish tour'
	}]
};

export default function createDialogs(settings) {
	return {
		intro: {
			title: 'Welcome to <span class="logo">&lt;<b>Tag</b>&gt;</span>!',
			message: [
				'Tag is an app designed to explain how web pages are constructed.',
				'If you are new to tag, you can use the Tour button in the toolbar.',
				'Otherwise, just click “OK” and get creating!'
			]
		},
		resetState: {
			title: 'Reset Tag',
			message: [
				'Are you sure you want to go back to the beginning?',
				'All of your current work will be cleared.'
			],
			buttons: [{
				type: 'cancel',
				label: 'Cancel'
			}, {
				type: 'submit',
				className: 'danger',
				label: 'Clear my work'
			}]
		},
		dropletBadPlacement: {
			title: 'Oops!',
			message: [
				'Almost there, but the Droplet you’ve chosen doesn’t go here.',
				'Try again and see if you can find the correct place.',
				'Remember, the target will be <span class="drop-zone accept"><span class="target"><b>green</b></span></span> when you can place the Droplet.'
			]
		},
		tour: [{
			title: 'Welcome to <span class="logo">&lt;<b>Tag</b>&gt;</span>!',
			message: [
				'Tag is an app designed to explain how web pages are constructed.',
				'The idea is simple: Place <b>elements</b> onto the <b>template</b>, and then use the ' +
					'<span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#icon-media-play"></use></svg>Run</span> button to see how the page will look in the <b>view</b>.',
				'Some parts of the tour will let you try things out before moving on. If you want to, use the <span class="pseudo-button">Try it out</span> button when you see it, then use <span class="pseudo-button"><svg class="icon" width="14" height="14"><use xlink:href="#icon-compass"></use></svg>Continue tour</span> to go back to the tour.'
			],
			buttons: tourButtons.proceed
		}, {
			title: 'The template',
			message: [
				'This is the template. It contains the source code for your web page, and is where you’ll add snippets of code.',
				'Add elements to the <span class="drop-zone"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span> targets to construct the page.'
			],
			overlay: false,
			attachment: {
				selector: '.main > .template',
				options: {
					placement: 'right',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.proceed
		}, {
			title: 'The pallet',
			message: [
				'This is the pallet. It contains Droplets, which can be added to the template above.'
			],
			overlay: false,
			attachment: {
				selector: 'section.pallet',
				options: {
					placement: 'top',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.proceed
		}, {
			title: 'Droplet',
			message: [
				'This is a Droplet. It can be added to the template above.',
				'Certain <span class="drop-zone"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span> targets only allow certain Droplets to be added to them.',
				'When a target goes green <span class="drop-zone accept"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span>, it means it can accept the Droplet you have chosen, or <span class="drop-zone decline"><span class="target"><b>' +
						settings.dropZone.label +
						'</b></span></span> if the Droplet can’t be placed there.',
				'Click on a Droplet and then click on one of the <span class="drop-zone"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span> targets in the template to attach it.'
			],
			overlay: false,
			attachment: {
				selector: 'section.pallet .droplet:first-child',
				options: {
					placement: 'top',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.try_it
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
			},
			buttons: tourButtons.try_it
		}, {
			title: 'All done!',
			message: [
				'Once you’ve used the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#icon-media-play"></use></svg>Run</span> button, the view has updated and your last change should now be showing here!'
			],
			overlay: false,
			attachment: {
				selector: 'section.view',
				options: {
					placement: 'left',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.finish
		}]
	};
};
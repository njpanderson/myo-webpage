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
			title: 'Welcome to <span class="logo">&lt;<b>tag</b>&gt;</span>!',
			message: [
				'<b>tag</b> is an app designed to show <b>how web pages are constructed</b>.',
				'If you are <b>new to tag</b>, you can use the “Start tour” button.',
				'Otherwise, just click “OK” and get building!'
			],
			buttons: [{
				type: 'tour',
				label: 'Start tour'
			}, {
				type: 'submit',
				label: 'OK'
			}]
		},
		resetState: {
			title: 'Reset tag',
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
		firstDropletDrop: function(droplet_output) {
			return {
				title: 'Well done!',
				message: [
					'<code>' + droplet_output + '</code>',
					'You’ve placed your <b>very first</b> Droplet onto the Template.',
					'Press the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button to see how it looks.'
				]
			};
		},
		lastDropletDrop: {
			title: 'Well done!',
			message: [
				'You’ve placed at <b>least one Droplet</b> on every target in the Template.',
				'Why not try the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button to see how it looks?'
			]
		},
		tour: [{
			title: 'Welcome to <span class="logo">&lt;<b>tag</b>&gt;</span>!',
			message: [
				'tag is an app designed to explain how web pages are constructed.',
				'The idea is simple: Place <b>Droplets</b> onto the <b>Template</b>, and then use the ' +
					'<span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button to see how the page will look in the <b>View</b>.'
				//'Some parts of the tour will let you try things out before moving on. If you want to, use the <span class="pseudo-button">Try it out</span> button when you see it, then use <span class="pseudo-button"><svg class="icon" width="14" height="14"><use xlink:href="#compass-sprite"></use></svg>Continue tour</span> to go back to the tour.'
			],
			buttons: tourButtons.proceed
		}, {
			title: 'The Template',
			message: [
				'This is the Template. It contains the code for your web page, and is where you’ll add snippets of code.',
				'Add Droplets to the <span class="drop-zone"><span class="target"><b>' +
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
			title: 'The Palette',
			message: [
				'This is the Palette. It contains Droplets, which can be added to the Template above.'
			],
			overlay: false,
			attachment: {
				selector: 'section.palette',
				options: {
					placement: 'top',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.proceed
		}, {
			title: 'Droplet',
			message: [
				'This is a Droplet. It can be added to the Template above.',
				'Certain <span class="drop-zone"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span> targets only allow certain Droplets to be added to them.',
				'When a target goes green <span class="drop-zone accept"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span>, it means it can accept the Droplet you have chosen, or <span class="drop-zone decline"><span class="target"><b>' +
						settings.dropZone.label +
						'</b></span></span> if the Droplet can’t be placed there.',
				'You can click on a Droplet and then click on one of the <span class="drop-zone"><span class="target"><b>' +
					settings.dropZone.label +
					'</b></span></span> targets in the Template to attach it.'
			],
			overlay: false,
			attachment: {
				selector: 'section.palette .droplet:first-child',
				options: {
					placement: 'top',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.proceed
		}, {
			title: 'The View',
			message: [
				'This is the View. It will show you how the page looks after running the code.',
				'Use the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button to update the View'
			],
			overlay: false,
			attachment: {
				selector: 'section.view',
				options: {
					placement: 'left',
					modifiers: tourDialogModifiers
				}
			},
			buttons: tourButtons.proceed
		}/*, {
			title: 'All done!',
			message: [
				'Once you’ve used the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button, the View has updated and your last change should now be showing here.'
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
		}*/, {
			title: 'End of tour',
			message: [
				'That’s everything. Now have a go yourself and see what you can build. Don’t forget to press the <span class="pseudo-button run"><svg class="icon" width="14" height="14"><use xlink:href="#media-play-sprite"></use></svg>Run</span> button to check how things look.',
				'Now get creating!'
			],
			overlay: false,
			buttons: tourButtons.finish
		}]
	};
}
export default {
	classes: {
		canvas: 'tag-canvas',
		canvas_active: 'active',
		droplet_active: 'droplet-active',
		is_dragging: 'dragging',
		item_dragging: 'item-dragging',
		dropzone: 'drop-zone',
		dropzone_target: 'target',
		dropzone_is_active: 'is-active',
		dropzone_is_target: 'is-target',
		attached: 'attached',
		text_element: 'text',
		hidden: 'hidden',
		button: 'button',
		button_animate: 'animate',
		droplet: {
			node: 'droplet',
			active: 'active',
		},
		dialog: {
			main: 'dialog',
			visible: 'visible',
			container: 'dialog-container',
			heading: 'dialog-heading',
			no_overlay: 'no-overlay'
		},
		toolbar: {
			separator: 'separator'
		}
	},
	selectors: {
		drop_zone: '.drop-zone .target',
		droplet: '.droplet',
		button_circle: '.circle'
	},
	template: {
		initial_flex_basis: 50
	},
	view: {
		src: 'view.html',
		autoUpdate: false
	},
	dropZone: {
		label: '...',
		warnOnBadPlacement: true
	},
	toolbar: [],
	onElementRender: null,
	showIntro: false,
};
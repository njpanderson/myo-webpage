export default {
	classes: {
		canvas: 'tag-canvas',
		canvas_active: 'active',
		droplet_active: 'droplet-active',
		is_dragging: 'dragging',
		droplet_dragging: 'droplet-dragging',
		dropzone: 'drop-zone',
		dropzone_target: 'target',
		dropzone_is_active: 'is-active',
		dropzone_is_target: 'is-target',
		attached: 'attached',
		text_element: 'text',
		hidden: 'hidden',
		droplet: {
			node: 'droplet',
			active: 'active',
		},
		dialog: {
			main: 'dialog',
			visible: 'visible',
			container: 'dialog-container',
			heading: 'dialog-heading'
		}
	},
	selectors: {
		drop_zone: '.drop-zone .target',
		droplet: '.droplet'
	},
	view: {
		src: 'view.html'
	},
	dropZone: {
		label: '...'
	}
};
import { GLYPHS } from '../components/views/Icon.jsx';
import { dialogModes } from './constants';

/**
 * The default settings applied to tag's App class on instantiation.
 * @typedef AppDefaults
 * @property {object} classes - Class definitions.
 * @property {object} selectors - CSS Selector definitions.
 * @property {object} template - Template options.
 * @property {number} template.initial_flex_basis=50 - The initial flex basis (width) of
 * the template container.
 * @property {object} view - View options.
 * @property {string} view.src='view.html' - Source filename for the view frame (relative to the App index).
 * @property {boolean} view.autoUpdate=false - Whether to automatically update the view when Droplet attachments change.
 * @property {object} dropZone - Drop Zone options.
 * @property {string} dropZone.label='...' - The label to use for Drop Zone targets.
 * @property {boolean} dropZone.warnOnBadPlacement=true - Produce a dialog when placing a Droplet into an invalid Drop Zone.
 * @property {boolean} dropZone.noticeOnFirstPlacement=true - Produce a dialog on the first valid placement of a Droplet
 * @property {boolean} dropZone.noticeOnLastPlacement=true - Produce a dialog when all of the Drop Zones have at least one attachment.
 * @property {ToolbarItem[]} toolbar - Toolbar items.
 */

export default {
	classes: {
		canvas: 'tag-canvas',
		canvas_active: 'active',
		droplet_active: 'droplet-active',
		is_dragging: 'dragging',
		item_dragging: 'item-dragging',
		dropzone_target: 'target',
		dropzone_target_outer: 'target-outer',
		dropzone_is_active: 'is-active',
		dropzone_is_target: 'is-target',
		attached: 'attached',
		text_element: 'text',
		hidden: 'hidden',
		button: 'button',
		button_animate: 'animate',
		popup: 'popup',
		tooltip: 'tooltip',
		field: {
			node: 'field',
			has_error: 'has-error',
			is_required: 'is-required'
		},
		template: {
			node: 'template',
			inner: 'template-inner'
		},
		droplet: {
			node: 'droplet',
			active: 'active',
		},
		dropzone: {
			node: 'drop-zone',
			possible_target: 'possible-target',
			will_accept: 'will-accept',
			will_decline: 'will-decline'
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
		warnOnBadPlacement: true,
		noticeOnFirstPlacement: true,
		noticeOnLastPlacement: true
	},
	toolbar: [{
		label: (state) => {
			if (state.UI.tour_stage !== null && state.UI.dialog.mode === dialogModes.NONE) {
				return 'Continue tour';
			} else {
				return 'Tour';
			}
		},
		icon: GLYPHS.COMPASS,
		method: 'startTour'
	}, {
		label: 'Reset',
		icon: GLYPHS.LOOP_CIRCULAR,
		method: 'reset'
	}, {
		label: 'Run',
		icon: GLYPHS.MEDIA_PLAY,
		method: 'updateView',
		className: 'run',
		separator: true
	}],
	onElementRender: null,
	showIntro: PRODUCTION
};
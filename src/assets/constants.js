/**
 * @module assets/constants
 */

/**
 * Action types
 * @private
 */
export const actionTypes = {
	UI_STATE: 'ui-state',
	ZONE_ADD_ATTACHMENT: 'zone-add-attachment',
	ZONE_EDIT_ATTACHMENT: 'zone-edit-attachment',
	ZONE_DETACH_ATTACHMENT: 'zone-detach-attachment',
	ZONE_CLEAR_ALL_ATTACHMENTS: 'zone-clear-all-attachments',
	SET_DIALOG_MODE: 'set-dialog-mode',
	SET_ACTIVE_DROPLET: 'set-active-droplet',
	SET_TOUR_STAGE: 'set-tour-stage',
	SHOW_TOOLTIP: 'show-tooltip',
	HIDE_TOOLTIP: 'hide-tooltip',
	SET_TOOLTIP_CONTENT: 'set-tooltip-content',
	COMPLETE_FIRST_DROP: 'complete-first-drop',
	COMPLETE_LAST_DROP: 'complete-last-drop',
	RESET_APP: 'reset-app'
};

/**
 * Dialog modes
 */
export const dialogModes = {
	NONE: 'none',
	GENERAL: 'general',
	EDIT_DROPLET: 'edit-droplet',
	TOUR: 'tour'
};

export const uiStates = {
	INITIALISING: 'initialising',
	ACTIVE: 'active'
};

export const messageCommands = {
	RELOAD: 'reload',
	RESET: 'reset',
	DIALOG: 'dialog',
	DIALOG_CALLBACK: 'dialog-callback'
};

export const errorCodes = {
	NOT_A_DROPLET: 'A valid Droplet instance must be passed to DropZone#willAccept.'
};

export const setLabels = {
	value: 'Value',
	attrs: 'Attributes',
	tagName: 'tag name',
	innerHTML: 'HTML content'
};
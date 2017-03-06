export const actionTypes = {
	UI_STATE: 'ui-state',
	ZONE_ADD_ATTACHMENT: 'zone-add-attachment',
	SET_DIALOG_MODE: 'set-dialog-mode'
};

export const dialogModes = {
	NONE: 'none',
	EDIT_DROPLET: 'edit-droplet'
};

export const uiStates = {
	INITIALISING: 'initialising',
	BUILDING: 'building',
	IN_DIALOG: 'in-dialog'
};

export const messageCommands = {
	RELOAD: 'reload'
};

export const errorCodes = {
	NOT_A_DROPLET: 'A valid Droplet instance must be passed to DropZone#willAccept.'
};
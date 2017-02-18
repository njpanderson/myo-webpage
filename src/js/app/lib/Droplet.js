/**
 * Callback fired on click/press of an unhandled link. Usually fired when a link
 * cannot be identified as relating to any internal CoM content. You can use this
 * callback to provide your own handling of unhandled links.
 * @callback dropZoneEditor
 * @param {boolean} save - Whether or not the editor window "save" button was pressed.
 * @param {object} data - Data from the editor form.
 */

var Droplet = function(settings) {
	this._settings = settings;

	this.init();
};

Droplet.prototype = {
	/**
	 * Initialisation
	 * @private
	 */
	init: function() {

	},

	/**
	 * Returns whether or not this droplet can be dropped into the specified drop zone.
	 * @param {string} dropzone_id - ID of the drop zone.
	 */
	canAttachTo: function(dropzone_id) {

	},

	/**
	 * Displays the editor window for this Droplet.
	 * @param {dropZoneEditor} callback - Invoked once the editor has been confirmed/cancelled
	 */
	showEditor: function(callback) {

	}
};

export default Droplet;
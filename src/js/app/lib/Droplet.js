/**
 * Callback fired on click/press of an unhandled link. Usually fired when a link
 * cannot be identified as relating to any internal CoM content. You can use this
 * callback to provide your own handling of unhandled links.
 * @callback dropZoneEditor
 * @param {boolean} save - Whether or not the editor window "save" button was pressed.
 * @param {object} data - Data from the editor form.
 */
import PropTypes from './PropTypes';

var Droplet = function(settings) {
	this._originalSettings = Object.deepAssign({}, settings);
	this.data = {
		name: settings.name,
		dropletType: settings.dropletType,
	};

	this.init();
};

Droplet.prototype = {
	/**
	 * Initialisation
	 * @private
	 */
	init: function() {
		this._setExtraFields();
	},

	_setExtraFields: function() {
		switch (this.data.dropletType) {
		case 'text':
			this.validateAndSet(['value']);
			break;

		case 'element':
			this.validateAndSet(['attrs', 'tagName', 'innerHTML']);
			break;

		case 'attribute':
			break;
		}
	},

	validateAndSet(values) {
		values.forEach((value) => {
			console.log('checking value', value);
			if (Droplet.PropTypes.hasOwnProperty(value)) {
				if (Droplet.PropTypes[value](this._originalSettings[value], value)) {
					this.data[value] = this._originalSettings[value];
				}
			} else {
				throw new Error('Droplet property "' + value + '" does not exist.');
			}
		});
	},

	/**
	 * Returns whether or not this droplet can be dropped into the specified drop zone.
	 * @param {DropZone} dropzone - ID of the drop zone.
	 */
	canAttachTo: function(dropzone) {

	},

	/**
	 * Displays the editor window for this Droplet.
	 * @param {dropZoneEditor} callback - Invoked once the editor has been confirmed/cancelled
	 */
	showEditor: function(callback) {

	}
};

Droplet.PropTypes = {
	value: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	dropletType: PropTypes.string.isRequired,
	attrs: PropTypes.object,
	tagName: PropTypes.string,
	innerHTML: PropTypes.string,
	editable: PropTypes.object
};

export default Droplet;
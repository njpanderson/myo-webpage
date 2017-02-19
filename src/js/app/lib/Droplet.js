/**
 * Callback fired on click/press of an unhandled link. Usually fired when a link
 * cannot be identified as relating to any internal CoM content. You can use this
 * callback to provide your own handling of unhandled links.
 * @callback dropZoneEditor
 * @param {boolean} save - Whether or not the editor window "save" button was pressed.
 * @param {object} data - Data from the editor form.
 */
import PropTypes from './PropTypes';

var Droplet, droplet_id = 0;

Droplet = function(settings) {
	this.id = 'droplet_' + ++droplet_id;
	this._originalSettings = Object.deepAssign({}, settings);
	this.data = {};
	this.name = null;
	this.dropletType = null;
	this.attachmentIds = [];

	this.init();
};

Droplet.prototype = {
	/**
	 * Initialisation
	 * @private
	 */
	init: function() {
		this.validateAndSet(['name', 'dropletType', 'attachmentIds'], this);

		this._setExtraFields();
	},

	_setExtraFields: function() {
		switch (this.dropletType) {
		case 'text':
			this.validateAndSet(['value'], this.data);
			break;

		case 'element':
			this.validateAndSet(['attrs', 'tagName', 'innerHTML'], this.data);
			break;

		case 'attribute':
			break;
		}
	},

	validateAndSet(values, context) {
		values.forEach((value) => {
			if (Droplet.PropTypes.hasOwnProperty(value)) {
				if (Droplet.PropTypes[value](
						this._originalSettings[value],
						value,
						this._originalSettings.name || null,
						this._originalSettings.dropletType || null
					)) {
					context[value] = this._originalSettings[value];
				}
			} else {
				throw new Error('Droplet property "' + value + '" definition does not exist.');
			}
		});
	},

	/**
	 * Displays the editor window for this Droplet.
	 * @param {dropZoneEditor} callback - Invoked once the editor has been confirmed/cancelled
	 */
	showEditor: function(callback) {
		callback(true, Object.assign({
			type: this.dropletType
		}, this.data));
	}
};

Droplet.PropTypes = {
	value: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	attachmentIds: PropTypes.arrayOf.string.isRequired,
	dropletType: PropTypes.string.isRequired,
	attrs: PropTypes.object,
	tagName: PropTypes.string.isRequired,
	innerHTML: PropTypes.string,
	editable: PropTypes.object
};

export default Droplet;
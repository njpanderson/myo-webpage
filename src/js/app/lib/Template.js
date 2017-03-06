import request from './ajax';
import DropZone from './DropZone';

var Template = function(settings = {}) {
	this.settings = Object.deepAssign(settings, {
		dropZone: {
			label: '...'
		}
	});

	this._drop_zones = {};
	this._max_zones = 100;
};

Template.prototype = {
	load: function(url) {
		return request.get(url)
			.then((response) => {
				if (response.text) {
					this._markup = response.text;
				}
			})
			.catch((error) => {
				throw new Error(error);
			});
	},

	create: function(markup = this._markup) {
		if (typeof markup === 'undefined') {
			throw new Error('Cannot call create() with no markup defined.');
		}

		// replace html with entities
		markup = markup.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#' + i.charCodeAt(0) + ';';
		});

		return this._createDropZones(markup);
	},

	_createDropZones: function(markup) {
		var zone, counter = 0;

		// loop through markup finding drop zones
		while ((zone = DropZone.fetchZone(markup)) !== null) {
			this._drop_zones[zone.id] = zone;
			counter += 1;

			if (counter === this._max_zones) {
				throw new Error('Maximum number of zones in template reached (' + this._max_zones + ').');
			}
		}

		for (zone in this._drop_zones) {
			markup = markup.replace(
				this._drop_zones[zone].tag,
				'<span class="drop-zone"' +
					' data-id="' + this._drop_zones[zone].id + '"' +
					' data-attachment="' + this._drop_zones[zone].attachmentId + '">' +
					this.settings.dropZone.label +
				'</span>'
			);
		}

		return markup;
	},

	getDropZoneById: function(id) {
		return this._drop_zones[id] || null;
	}
};

export default Template;
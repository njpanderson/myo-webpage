import request from './ajax';
import DropZone from './DropZone';
import Droplet from './Droplet';

var Template = function(settings = {}) {
	this.settings = settings;
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
		markup = Template.entities(markup);

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
				'<span' +
					' data-id="' + this._drop_zones[zone].id + '"' +
					' data-attachment="' + this._drop_zones[zone].attachmentId + '">' +
				'</span>'
			);
		}

		return this.createDropZoneData(markup);
	},

	createDropZoneData: function(markup) {
		var sandbox = document.createElement('div'),
			data = [];
		sandbox.innerHTML = markup;

		sandbox.childNodes.forEach((node) => {
			switch (node.nodeType) {
			case Node.TEXT_NODE:
				data.push({
					type: 'text',
					content: node.textContent
				});
				break;

			case Node.ELEMENT_NODE:
				data.push({
					type: 'dropzone',
					id: node.dataset.id,
					attachment: node.dataset.attachment
				});
				break;
			}
		});

		return data;
	},

	getDropZoneById: function(id) {
		return this._drop_zones[id] || null;
	}
};

Template.renderDroplet = function(droplet, data) {
	var output;
	if (!(droplet instanceof Droplet)) {
		throw new Error('droplet argument must be a Droplet instance');
	}

	switch (droplet.dropletType) {
	case 'element':
		output = Template.renderElementDroplet(data);
		break;

	case 'text':
		output = Template.renderTextDroplet(data);
		break;

	case 'attribute':
		output = Template.renderAttributeDroplet(data);
		break;
	}

	return output;
};

Template.renderElementDroplet = function(data) {
	var attrs = [],
		markup, attr;
	console.log('renderElementDroplet', data);
	markup = '<' + data.tagName;

	if (data.attrs) {
		for (attr in data.attrs) {
			attrs.push(attr += '="' + Template.entities(data.attrs[attr]) + '"');
		}

		if (attrs.length) {
			markup += ' ' + attrs.join(' ');
		}
	}

	if (data.innerHTML) {
		markup += '>' + data.innerHTML +
			'</' + data.tagName + '>';
	} else {
		markup += '/>';
	}

	return markup;
};

Template.renderTextDroplet = function(data) {
	console.log('renderTextDroplet', data);
	return Template.entities(data.value);
};

Template.renderAttributeDroplet = function(data) {
	console.log('renderAttributeDroplet', data);
	return data.key + '="' + Template.entities(data.value) + '"';
};

Template.entities = function(str) {
	return str.replace(/[\u00A0-\u9999<>\&]/gim, (i) =>
		('&#' + i.charCodeAt(0) + ';')
	);
};

export default Template;
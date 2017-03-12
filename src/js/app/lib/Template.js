import request from './ajax';
import DropZone from './DropZone';
import Droplet from './Droplet';

var Template = function(settings = {}) {
	this.settings = settings;
	this._drop_zones = {};
	this._template = [];
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
				throw new Error(
					'Maximum number of zones in template reached (' + this._max_zones + ').'
				);
			}
		}

		// loop through collected drop zones and replace tags in markup
		for (zone in this._drop_zones) {
			markup = markup.replace(
				this._drop_zones[zone].tag,
				'<span' +
					' data-id="' + this._drop_zones[zone].id + '"' +
					' data-attachment="' + this._drop_zones[zone].attachmentId + '">' +
				'</span>'
			);
		}

		this._template = this._createTemplateArray(markup);

		return {
			drop_zones: this._drop_zones,
			template: this._template
		};
	},

	_createTemplateArray: function(markup) {
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
					zone: this._drop_zones[node.dataset.id]
				});
				break;
			}
		});

		return data;
	},

	renderAsHTML: function(zones, getDropletById) {
		var html = '';

		this._template.forEach((node) => {
			if (node.type === 'text') {
				// plain text node
				html += node.content;
			} else if (node.type === 'dropzone' && zones[node.zone.id]) {
				// drop zone with attachments
				zones[node.zone.id].attachments.forEach((attachment) => {
					var droplet = getDropletById(attachment.droplet_id),
						data = Object.deepAssign({}, droplet.data, attachment.data);

					html += Template.renderDroplet(
						droplet,
						data
					);
				});
			}
		});

		return html;
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
	// !TODO - make sure self-closing tags are correctly rendered
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

	if (data.innerHTML || Template.containerTags.indexOf(data.tagName) !== -1) {
		markup += '>' + (data.innerHTML || '') +
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

Template.containerTags = ['a'];

export default Template;
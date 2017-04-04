import request from './ajax';
import DropZone from './DropZone';
import Droplet from './Droplet';

var Template = function(parent, settings = {}) {
	this._parent = parent;
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
			data = [],
			node, a;
		sandbox.innerHTML = markup;

		for (a = 0; (node = sandbox.childNodes[a]); a += 1) {
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
		}

		return data;
	},

	renderAsHTML: function(zones) {
		var html = '';

		this._template.forEach((node) => {
			if (node.type === 'text') {
				// plain text node
				html += node.content;
			} else if (node.type === 'dropzone' && zones[node.zone.id]) {
				// drop zone with attachments
				zones[node.zone.id].attachments.forEach((attachment) => {
					var droplet = this._parent._UI.getDropletById(attachment.droplet_id),
						data = Object.deepAssign({}, droplet.data, attachment.data);

					html += Template.renderDroplet(
						droplet,
						data,
						this._parent._UI.getDropZoneById(node.zone.id),
						this.settings.onElementRender
					);
				});
			}
		});

		return html;
	}
};

Template.renderDroplet = function(droplet, data, drop_zone, is_output = true) {
	var output;

	if (!(droplet instanceof Droplet)) {
		throw new Error('droplet argument must be a Droplet instance');
	}

	switch (droplet.dropletType) {
	case 'element':
		output = Template.renderElementDroplet(data, droplet, drop_zone, is_output);
		break;

	case 'text':
		output = Template.renderTextDroplet(data, droplet, drop_zone, is_output);
		break;

	case 'attribute':
		output = Template.renderAttributeDroplet(data, droplet, drop_zone, is_output);
		break;
	}

	return output;
};

Template.renderElementDroplet = function(data, droplet, drop_zone, is_output) {
	// !TODO - make sure self-closing tags are correctly rendered
	var attrs = [],
		markup = {},
		attr;

	markup.open = '<' + data.tagName;

	if (data.attrs) {
		for (attr in data.attrs) {
			attrs.push(attr += '="' + Template.entities(data.attrs[attr]) + '"');
		}

		if (attrs.length) {
			markup.open += ' ' + attrs.join(' ');
		}
	}

	if (data.innerHTML || Template.containerTags.indexOf(data.tagName) !== -1) {
		markup.open += '>';
		markup.innerHTML = (data.innerHTML || '');
		markup.close = '</' + data.tagName + '>';
	} else {
		markup.close = '/>';
	}

	markup = Template.onElementRender(
		markup,
		droplet,
		drop_zone,
		is_output
	);

	return markup.open + markup.innerHTML + markup.close;
};

Template.renderTextDroplet = function(data, droplet, drop_zone, is_output) {
	var value = Template.onElementRender(
		data.value,
		droplet,
		drop_zone,
		is_output
	);

	return Template.entities(value);
};

Template.renderAttributeDroplet = function(data, droplet, drop_zone, is_output) {
	var markup = {
		key: data.key,
		value: data.value
	};

	markup = Template.onElementRender(
		markup,
		droplet,
		drop_zone,
		is_output
	);

	return markup.key + '="' + Template.entities(markup.value) + '"';
};

Template.entities = function(str) {
	return str.replace(/[\u00A0-\u9999<>\&]/gim, (i) =>
		('&#' + i.charCodeAt(0) + ';')
	);
};

Template.onElementRender = function(markup, droplet, zone, is_output) {
	return markup;
};

Template.containerTags = ['a'];

export default Template;
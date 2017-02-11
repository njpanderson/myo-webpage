import request from './ajax';

var Templates = function(settings = {}) {
	this.settings = Object.deepAssign(settings, {
		dropZone: {
			label: '...'
		}
	});
};

Templates.prototype = {
	load: function(url) {
		return request.get(url)
			.then((response) => {
				if (response.text) {
					this._markup = response.text;
				}
			})
			.catch(console.error);
	},

	create: function(markup = this._markup) {
		if (typeof markup === 'undefined') {
			throw new Error('Cannot call create() with no markup defined.');
		}

		// replace html with entities
		markup = markup.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
			return '&#' + i.charCodeAt(0) + ';';
		});

		// replace template keys
		markup = markup.replace(
			/{{\s?(.*?)\s?}}/g,
			'<span class="drop-zone" data-attachment="$1">' +
				this.settings.dropZone.label +
			'</span>'
		);

		return markup;
	}
};

export default Templates;
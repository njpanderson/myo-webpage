import sprite from '../../dist/svg-sprite.json';

const document = window.document || null,
	glyph_re = new RegExp('-', 'g');

var GLYPHS = {
	length: 0
};

export function attachSVG() {
	if (document) {
		// add svg sprite data on dom load
		document.addEventListener('DOMContentLoaded', function() {
			var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

			// set styles to hide
			svg.style.position = 'absolute';
			svg.style.width = 0;
			svg.style.height = 0;

			// set innerHTML for svg data
			svg.innerHTML = sprite.svg;

			// inject svg into top of document
			document.body.insertBefore(svg, document.body.firstChild);

			// clean up
			sprite.svg = null;
		});
	}
}

if (!GLYPHS.length) {
	// loop through glyphs and create exportable object
	sprite.glyphs.forEach((glyph) => {
		var key = (glyph.toString().slice(0, -7).toUpperCase());

		key = key.replace(glyph_re, '_');

		GLYPHS[key] = '#' + glyph;
		GLYPHS.length += 1;
	});
}

export default GLYPHS;
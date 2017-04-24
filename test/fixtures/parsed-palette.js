import fs from 'fs';

import Droplet from '../../src/lib/Droplet';

var palette_json = fs.readFileSync('test/fixtures/palette.json', {
		encoding: 'UTF-8'
	}),
	palette_data = JSON.parse(palette_json),
	palette;

palette = [
	new Droplet(palette_data[0], 1),
	new Droplet(palette_data[1], 2)
];

export default palette;
import fs from 'fs';

import Droplet from '../../src/lib/Droplet';

var pallet_json = fs.readFileSync('test/fixtures/pallet.json', {
		encoding: 'UTF-8'
	}),
	pallet_data = JSON.parse(pallet_json),
	pallet;

pallet = [
	new Droplet(pallet_data[0], 1),
	new Droplet(pallet_data[1], 2)
];

export default pallet;
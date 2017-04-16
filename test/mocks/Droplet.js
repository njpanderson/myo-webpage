import Droplet from '../../src/lib/Droplet';

var droplet_id = 1;

/**
 * A super simple class that uses a local, re-settable droplet ID for the purposes
 * of syncronising with the tested Droplet class.
 */
var MockDroplet = function(settings) {
	return new Droplet(settings, droplet_id++);
};

export default MockDroplet;

/**
 * Allows for re-setting the droplet ID in-between tests.
 */
export const resetDropletCounter = function(to = 1) {
	droplet_id = to;
};
import { checkStorage } from './utils';

var JSON = JSON || window.JSON;
var store = window.localStorage || window.sessionStorage;

var Storage = function(prefix) {
	this.prefix = prefix + '_';
	this.storageEnabled = checkStorage('localStorage');
};

Storage.prototype = {
	get: function(key, default_value) {
		var value;

		if (this.storageEnabled &&
			(value = store.getItem(this.prefix + key)) !== null) {
			try {
				value = JSON.parse(value);
				return value;
			} catch(e) {
				return default_value;
			}
		}

		return default_value;
	},

	set: function(key, value) {
		if (this.storageEnabled) {
			store.setItem(this.prefix + key, JSON.stringify(value));
		}
	}
};

export default Storage;
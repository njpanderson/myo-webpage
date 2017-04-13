var Communicator = function(id, origin, callbacks = {}) {
	if (typeof id !== 'string') {
		throw new Error('Please choose a string-based ID for the guest.');
	}

	if (typeof origin !== 'string') {
		throw new Error('Please choose a string-based origin address.');
	}

	this._settings = {
		name: 'tag-comm-data'
	};

	this._guests = {};
	this._queue = {};
	this.id = id;

	this._origin = origin;
	this._callbacks = Object.assign({
		message: null
	}, callbacks);

	window.addEventListener('message', this._receiveMessage.bind(this), false);

	this._sendPing();
};

Communicator.prototype = {
	/**
	 * Attempt to ping source window
	 */
	_sendPing: function(node) {
		var ping = this._createMessage(null, {
			ping: this.id
		});

		if (!node) {
			if (window.opener) {
				node = window.opener;
			} else if (window.top !== window) {
				node = window.top;
			}
		}

		if (node) {
			this._post(node, ping);
		}
	},

	_sendPong: function(node) {
		var pong = this._createMessage(null, {
			pong: this.id
		});

		this._post(node, pong);
	},

	/**
	 * Registers a single guest for communication purposes.
	 * @param {string} id - Guest ID. Used when sending messages.
	 * @param {mixed} dest - Destination node.
	 */
	registerGuestAddress: function(id, dest) {
		if (typeof dest === 'undefined') {
			throw new Error(
				'Cannot register address for ' + id + '. ' +
				'A guest address DOM node, window or frame must be defined.'
			);
		}

		if (!('postMessage' in dest)) {
			throw new Error(
				'Communicator cannot send messages to destination. Please choose an HTMLElement ' +
				'that supports the postMessage method'
			);
		}

		if (typeof id !== 'string') {
			throw new Error('Please choose a string-based ID for the guest.');
		}

		// register local address for guest
		this._setGuestData(id, {
			id,
			node: dest
		});

		// start timer
		if (this.timer) {
			window.clearInterval(this.timer);
		}
	},

	/**
	 * Sets or replaces the guest data.
	 * @param {string} id - Guest ID.
	 * @param {object} data - Guest data.
	 * @private
	 */
	_setGuestData: function(id, data) {
		if (!this._guests[id]) {
			this._guests[id] = {
				live: false,
				node: null
			};
		}

		Object.assign(this._guests[id], data);
	},

	/**
	 * Sends a message to the defined guest.
	 * @param {string} to - Guest ID, as stored.
	 * @param {mixed} message - Any JS compatible data to send as a message.
	 */
	send: function(to, message) {
		var guest = this._getGuestById(to);

		if (guest && guest.live) {
			// post message immediately
			this._post(to, this._createMessage(message));
		} else {
			// queue message for posting
			this._addToQueue(to, message);
		}
	},

	/**
	 * Adds a message to the local 'outbox' for the guest (by ID).
	 */
	_addToQueue: function(to, message) {
		if (!this._queue[to]) {
			this._queue[to] = [];
		}

		this._queue[to].push(message);
	},

	_sendQueue: function(to) {
		var a;

		if (this._queue[to] && this._guests[to]) {
			// send messages in the order they were queued
			for (a = 0; a < this._queue[to].length; a += 1) {
				this._post(
					this._guests[to].node,
					this._createMessage(this._queue[to][a])
				);
			}

			// clear queue for this recipient
			this._queue[to] = [];
		}
	},

	/**
	 * Gets a communicator guest by its ID, or returns `null`.
	 * @returns {mixed} Guest data, or `null`.
	 * @private
	 */
	_getGuestById: function(id) {
		return this._guests[id] || null;
	},

	/**
	 * Get a guest by known node (i.e. that registered in `this._guests`)
	 * @private
	 */
	_getGuestByNode: function(node) {
		var id;

		for (id in this._guests) {
			if (this._guests.hasOwnProperty(id) &&
				this._guests[id].node === node) {
				return this._getGuestById(id);
			}
		}

		return null;
	},

	/**
	 * Actually posts the message to the destination.
	 * @param {string} to - Guest ID.
	 * @param {mixed} message - Any JS compatible data to send as a message.
	 * @private
	 */
	_post: function(to, message) {
		var guest, node;

		if (typeof to === 'string') {
			guest = this._getGuestById(to);

			if (!guest.node) {
				throw new Error(
					'Cannot communicate with guest "' + to + '". Has its Node address been registered?'
				);
			}

			node = guest.node;
		} else {
			node = to;
		}

		node.postMessage(message, this._origin);
	},

	/**
	 * Invoked when a live message is received.
	 * @private
	 */
	_receiveMessage: function(event) {
		var origin = event.origin || event.originalEvent.origin,
			source = event.source || event.originalEvent.source,
			message = event.data,
			guest;

		if (origin !== location.origin)
			return;

		if ((message.ping || message.pong) && this._getGuestByNode(source)) {
			// received a ping/pong from valid source
			guest = message.ping || message.pong;

			this._setGuestLive(guest);
			this._sendQueue(guest);

			if (message.ping) {
				// pong back a ping (don't pong a pong or we'll be here forever)
				this._sendPong(source);
			}
		}

		if (this._callbacks.message && message.originalMessage) {
			this._callbacks.message(message.originalMessage);
		}
	},

	_setGuestLive: function(id) {
		this._setGuestData(id, {
			live: true
		});
	},

	_createMessage: function(message, data) {
		return Object.assign({}, data, {
			host: this.id,
			originalMessage: message
		});
	}
};

export default Communicator;
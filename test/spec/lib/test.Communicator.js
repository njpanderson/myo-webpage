import { expect } from 'chai';

describe('Communicator', function() {
	let Communicator, id, comm, post_node, guest_id, callbacks;

	before(() => {
		Communicator = require('../../../src/lib/Communicator').default;
	});

	beforeEach(() => {
		id = 'test-host';
		guest_id = 'test-guest'
		callbacks = [];

		comm = new Communicator(id, 'test-origin', {
			message: function() {
				callbacks.push([...arguments]);
			}
		});

		post_node = {
			posted: [],
			postMessage: function(message, origin) {
				this.posted.push({
					message,
					origin
				});
			}
		};
	});

	it('Throws when instantiating with an invalid ID', () => {
		expect(() => {
			new Communicator(false);
		}).to.throw(Error, 'Please choose a string-based ID for the host');
	});

	it('Throws when instantiating with an invalid origin', () => {
		expect(() => {
			new Communicator('id', false);
		}).to.throw(Error, 'Please choose a string-based origin address');
	});

	describe('#_sendPing', function() {
		it('Sends a ping to a defined node', () => {
			comm._sendPing(post_node);
			expect(post_node.posted[0].message.ping).to.equal(id);
		});
	});

	describe('#_sendPong', function() {
		it('Sends a pong to a defined node', () => {
			comm._sendPong(post_node);
			expect(post_node.posted[0].message.pong).to.equal(id);
		});
	});

	describe('#registerGuestAddress', function() {
		it('Registers a single guest', () => {
			comm.registerGuestAddress(guest_id, post_node);
			expect(comm._guests[guest_id].node).to.equal(post_node);
			expect(comm._guests[guest_id].live).to.be.false;
		});

		it('Throws without a dest argument', () => {
			expect(() => {
				comm.registerGuestAddress('test-fail');
			}).to.throw(Error, 'Cannot register address for test-fail');
		});

		it('Throws if dest is not a valid post-able node', () => {
			expect(() => {
				comm.registerGuestAddress('test-fail', document.createElement('P'));
			}).to.throw(Error, 'Communicator cannot send messages to destination');
		});

		it('Throws if id is not a basic string', () => {
			expect(() => {
				comm.registerGuestAddress({ name: 'test-fail' } , post_node);
			}).to.throw(TypeError, 'Please choose a string-based ID for the guest');
		});
	});

	describe('#_setGuestData', function() {
		it('Replaces the data of an existing guest with a matching ID', () => {
			comm._setGuestData('replace-id', { value: 'data1' });
			comm._setGuestData('replace-id', { value: 'data2' });

			expect(comm._guests['replace-id'].value).to.equal('data2');
		});
	});

	describe('#send', function() {
		it('Queues a message to a non-live guest', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm.send(guest_id, 'message');
			expect(comm._queue[guest_id]).to.have.length(1);
		});

		it('Immediately sends a message to a live guest', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm._guests[guest_id].live = true;
			comm.send(guest_id, 'message');
			expect(post_node.posted).to.have.length(1);
		});

		it('Throws with an invalid guest id', () => {
			comm.registerGuestAddress(guest_id, post_node);
			expect(() => {
				comm.send('invalid-guest-id', 'message');
			}).to.throw(Error, 'Invalid guest id');
		});
	});

	describe('#_sendQueue', function() {
		it('Dispatches messages in the queue and leaves the queue empty', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm.send(guest_id, 'message1');
			comm.send(guest_id, 'message2');
			comm.send(guest_id, 'message3');
			comm._sendQueue(guest_id);

			expect(post_node.posted).to.have.length(3);
			expect(post_node.posted[0].message.originalMessage).to.equal('message1');
			expect(post_node.posted[1].message.originalMessage).to.equal('message2');
			expect(post_node.posted[2].message.originalMessage).to.equal('message3');
			expect(comm._queue[guest_id]).to.have.length(0);
		});
	});

	describe('#_getGuestById', function() {
		it('Returns a single guest by its ID', () => {
			var guest;
			comm.registerGuestAddress(guest_id, post_node);
			guest = comm._getGuestById(guest_id);
			expect(guest.id).to.equal(guest_id);
		});

		it('Returns null with an invalid guest ID', () => {
			expect(comm._getGuestById(guest_id)).to.equal(null);
		});
	});

	describe('#_getGuestByNode', function() {
		it('Returns a single guest by its registered node', () => {
			var guest;
			comm.registerGuestAddress(guest_id, post_node);
			guest = comm._getGuestByNode(post_node);
			expect(guest.id).to.equal(guest_id);
		});

		it('Returns null with an invalid guest node', () => {
			var guest;
			guest = comm._getGuestByNode(post_node);
			expect(guest).to.equal(null);
		});
	});

	describe('#_receiveMessage', function() {
		it('Handles receipt of pings', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm._receiveMessage({
				origin: null,
				source: null,
				data: {
					ping: guest_id
				},
				originalEvent: {
					origin: 'null',
					source: post_node
				}
			});
			expect(post_node.posted).to.have.length(1);
			expect(post_node.posted[0].message.pong).to.equal('test-host');
		});

		it('Sets a guest as live when receiving a pong', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm._receiveMessage({
				origin: null,
				source: null,
				data: {
					pong: guest_id
				},
				originalEvent: {
					origin: 'null',
					source: post_node
				}
			});
			expect(comm._guests[guest_id].live).to.be.true;
		});

		it('Handles receipt of normal messages', () => {
			comm.registerGuestAddress(guest_id, post_node);
			comm._receiveMessage({
				origin: 'null',
				source: post_node,
				data: {
					originalMessage: 'message test',
					id: 'message-id'
				},
				originalEvent: {
					origin: 'null'
				}
			});

			expect(callbacks[0][0]).to.equal('message test');
			expect(callbacks[0][1]).to.equal('message-id');
		});
	});

	describe('#_createMessage', function() {
		it('Creates a Communicator compatible message', () => {
			var message = comm._createMessage(
				'message',
				{},
				'message-id'
			);

			expect(message.host).to.equal('test-host');
			expect(message.id).to.equal('message-id');
			expect(message.originalMessage).to.equal('message');
		});
	});

	describe('#_generateSendId', function() {
		it('Generates a unique ID', () => {
			var ids = [],
				a, uniques, duplicates;

			for (a = 0; a < 100; a += 1) {
				ids.push(comm._generateSendId('test'));
			}

			uniques = ids
				.map((id) => {
					// produce array of objects of each id with a count starting at 1
					return { count: 1, id };
				})
				.reduce((accumulator, item) => {
					// reduce array into an object containing counts of each item found
					if (accumulator[item.id]) {
						accumulator[item.id] += item.count;
					} else {
						accumulator[item.id] = 1;
					}

					return accumulator;
				}, {});

			duplicates = Object
				// get keys of uniques object and loop with filter
				.keys(uniques)
				// filter return only items that have a value higher than 1
				.filter(a => (uniques[a] > 1));

			expect(duplicates).to.have.length(0);
		});
	});
});
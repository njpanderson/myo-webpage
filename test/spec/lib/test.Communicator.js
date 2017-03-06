import { expect } from 'chai';

describe('Communicator', function() {
	let Communicator;

	before(() => {
		Communicator = require('../../../src/js/app/lib/Communicator').default;
	});

	it('Should instantiate', function() {
		var comm = new Communicator();
		expect(comm).to.be.an.instanceof(Communicator);
	});

	describe('#_sendPing', function() {
		it('Sends a ping to a defined node');
	});

	describe('#_sendPong', function() {
		it('Sends a pong to a defined node');
	});

	describe('#registerGuestAddress', function() {
		it('Registers a single guest');
		it('Throws without a dest argument');
		it('Throws if dest is not a valid post-able node');
		it('Throws if id is not a basic string');
	});

	describe('#_setGuestData', function() {
		it('Creates a new guest');
		it('Replaces the data of an existing guest with a matching ID');
	});

	describe('#send', function() {
		it('Queues a message to a non-live guest');
		it('Immediately sends a message to a live guest');
		it('Throws with an invalid guest id');
	});

	describe('#_addToQueue', function() {
		it('Queues a single message');
	});

	describe('#_sendQueue', function() {
		it('Dispatches messages in the queue and leaves the queue empty');
	});

	describe('#_getGuestById', function() {
		it('Returns a single guest by its ID');
		it('Returns null with an invalid guest ID');
	});

	describe('#_getGuestByNode', function() {
		it('Returns a single guest by its registered node');
		it('Returns null with an invalid guest node');
	});

	describe('#_post', function() {
		it('Attempts to post a message to the defined node by guest ID');
		it('Throws if a guest without a node is defined');
		it('Throws if a guest could not be found');
	});

	describe('#_receiveMessage', function() {
		it('Handles receipt of pings');
		it('Handles receipt of normal messages');
	});

	describe('#_setGuestLive', function() {
		it('Sets a guest as live');
	});

	describe('#_createMessage', function() {
		it('Creates a Communicator compatible message');
		it('Leaves original object intact and unchanged');
	});
});
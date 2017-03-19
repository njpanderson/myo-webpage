import { expect } from 'chai';

describe('DropZone', function() {
	let DropZone;

	before(() => {
		DropZone = require('../../../src/lib/DropZone').default;
	});

	it('Should instantiate', function() {
		var dropzone = new DropZone({
			attachmentId: 'none'
		}, '');
		expect(dropzone).to.be.an.instanceof(DropZone);
	});

	describe('Instantiation sanity checks', function() {
		it('Should throw with an empty tag');
		it('Should throw without an attachmentId');
	});

	describe('#willAccept', function() {
		it('Will throw with an invalid Droplet');
		it('Will return false if the maximum number of attachments is reached');
		it('Will return false if the attachment ID is ineligible');
		it('Will return true if Droplet is accepted');
	});

	describe('.fetchZone', function() {
		it('Returns null if a drop zone cannot be found');
		it('Returns a valid DropZone instance if a drop zone can be found');
	});

	describe('.checkSyntax', function() {
		it('Returns false if the tag is completely corrupted');
		it('Returns false if the tag ID does not start with a letter');
		it('Returns false if the tag ID contains something other than accepted characters');
		it('Returns false if the tag quantity is above 100');
		it('Returns false if the tag quantity is below 1');
		it('Returns false if the tag quantity is non numeric, and not an asterisk');
		it('Returns true if the tag is well formed (id + infinite)');
		it('Returns true if the tag is well formed (id + finite)');
		it('Returns true if the tag is well formed (asterisk + infinite)');
		it('Returns true if the tag is well formed (asterisk + finite)');
	});

	describe('.syntaxFault', function() {
		it('Logs the error without a char argument');
		it('Logs the error with a char argument');
	});
});
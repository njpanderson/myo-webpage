import fs from 'fs';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import useMockery from '../helpers/mockery';
import parsed_pallet from '../fixtures/parsed-pallet';
import Droplet, { resetDropletCounter } from '../mocks/Droplet';

describe('App', function() {
	let App, pallet;

	chai.use(chaiAsPromised);

	useMockery(() => {
		useMockery
			.registerMultiple({
				'./styles/main.scss': require('../mocks/styles/main'),
				'./assets/defaults': require('../fixtures/defaults'),
				'./lib/UI.jsx': require('../mocks/UI'),
				'./lib/Template': require('../mocks/Template'),
				'./lib/Droplet': Droplet,
				'./lib/ajax': require('../mocks/node/ajax'),
				'./components/views/Icon.jsx': require('../mocks/views/Icon')
			});
	});

	before(() => {
		App = require('../../src/Index').default;

		pallet = fs.readFileSync('test/fixtures/pallet.json', {
			encoding: 'UTF-8'
		});

		pallet = JSON.parse(pallet);
	});

	beforeEach(() => {
		resetDropletCounter();
	});

	it('Should instantiate', function() {
		var app = new App();
		expect(app).to.be.an.instanceof(App);
	});

	it('Should correctly obtain app UI refs', function() {
		var app = new App();
		expect(app._refs.ui.app).to.equal(document.querySelector('.app'));
	});

	describe('#load (with JSON)', function() {
		it('Should load a template', function() {
			var app = new App();
			return app.load('test/fixtures/template.html', 'test/fixtures/pallet.json').then(() => {
				expect(app._data.template).to.be.an('array');
				expect(app._data.drop_zones).to.be.an('object');
			});
		});

		it('Should load a pallet', function() {
			var app = new App();
			return app.load('test/fixtures/template.html', 'test/fixtures/pallet.json').then(() => {
				expect(app._data.pallet).to.eql(parsed_pallet);
			});
		});
	});

	describe('#load (with JS object)', function() {
		it('Should load an object pallet', function() {
			var app = new App();
			return app.load('test/fixtures/template.html', pallet).then(() => {
				expect(app._data.pallet).to.eql(parsed_pallet);
			});
		});
	});

	describe('#load (error handling)', function() {
		it('Should throw with a non-existent template file', function() {
			var app = new App();
			return expect(app.load('404.html', 'test/fixtures/testpallet.json'))
				.to.eventually.be.rejectedWith(Error, '404');
		});

		it('Should throw with a non-existent pallet file', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', '404.json'))
				.to.eventually.be.rejectedWith(Error, '404');
		});

		it('Should throw with invalid pallet JSON data', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', 'test/fixtures/corrupted.json'))
				.to.eventually.be.rejectedWith(Error, 'could not be parsed');
		});

		it('Should throw with empty/invalid pallet JSON', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', 'test/fixtures/empty.json'))
				.to.eventually.be.rejectedWith(Error, 'isn’t a valid array in JSON format');
		});
	});
});
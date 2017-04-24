import fs from 'fs';

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import useMockery from '../helpers/mockery';
import parsed_palette from '../fixtures/parsed-palette';
import Droplet, { resetDropletCounter } from '../mocks/Droplet';

describe('App', function() {
	let App, palette;

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

		palette = fs.readFileSync('test/fixtures/palette.json', {
			encoding: 'UTF-8'
		});

		palette = JSON.parse(palette);
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
			return app.load('test/fixtures/template.html', 'test/fixtures/palette.json').then(() => {
				expect(app._data.template).to.be.an('array');
				expect(app._data.drop_zones).to.be.an('object');
			});
		});

		it('Should load a palette', function() {
			var app = new App();
			return app.load('test/fixtures/template.html', 'test/fixtures/palette.json').then(() => {
				expect(app._data.palette).to.eql(parsed_palette);
			});
		});
	});

	describe('#load (with JS object)', function() {
		it('Should load an object palette', function() {
			var app = new App();
			return app.load('test/fixtures/template.html', palette).then(() => {
				expect(app._data.palette).to.eql(parsed_palette);
			});
		});
	});

	describe('#load (error handling)', function() {
		it('Should throw with a non-existent template file', function() {
			var app = new App();
			return expect(app.load('404.html', 'test/fixtures/testpalette.json'))
				.to.eventually.be.rejectedWith(Error, '404');
		});

		it('Should throw with a non-existent palette file', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', '404.json'))
				.to.eventually.be.rejectedWith(Error, '404');
		});

		it('Should throw with invalid palette JSON data', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', 'test/fixtures/corrupted.json'))
				.to.eventually.be.rejectedWith(Error, 'could not be parsed');
		});

		it('Should throw with empty/invalid palette JSON', function() {
			var app = new App();
			return expect(app.load('test/fixtures/template.html', 'test/fixtures/empty.json'))
				.to.eventually.be.rejectedWith(Error, 'isn’t a valid array in JSON format');
		});
	});
});
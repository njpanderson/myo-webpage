import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import useMockery from '../helpers/mockery';

describe('Index', function() {
	let App;

	chai.use(chaiAsPromised);

	useMockery(() => {
		useMockery
			.registerMultiple({
				'./styles/main.scss': require('../mocks/styles/main'),
				'./assets/defaults': require('../fixtures/defaults'),
				'./lib/UI.jsx': require('../mocks/UI'),
				'./lib/Template': require('../mocks/Template'),
				'./lib/ajax': require('../mocks/node/ajax'),
				'./components/views/Icon.jsx': require('../mocks/views/Icon')
			});
	});

	before(() => {
		App = require('../../src/Index').default;
	});

	it('Should instantiate', function() {
		var app = new App();
		expect(app).to.be.an.instanceof(App);
	});

	it('Should correctly obtain app UI refs', function() {
		var app = new App();
		expect(app._refs.ui.app).to.equal(document.querySelector('.app'));
	});

	it('Should load a template and pallet', function() {
		var app = new App();
		return app.load('test/fixtures/template.html', 'testpallet.json').then(() => {
			expect(app._data.template).to.be.an('array');
			expect(app._data.drop_zones).to.be.an('object');
			expect(app._data.pallet).to.be.an('array');
		});
	});

	it('Should throw with a non-existent template file', function() {
		var app = new App();
		return expect(app.load('404.html', 'testpallet.json'))
			.to.eventually.be.rejectedWith(Error, '404');
	});

	it('Should throw with a non-existent pallet file', function() {
		var app = new App();
		return expect(app.load('test/fixtures/template.html', '404.json'))
			.to.eventually.be.rejectedWith(Error, '404');
	});

	it('Should throw with invalid pallet JSON data', function() {
		var app = new App();
		return expect(app.load('test/fixtures/template.html', 'corrupted.json'))
			.to.eventually.be.rejectedWith(Error, 'could not be parsed');
	});

	it('Should throw with empty/invalid pallet JSON', function() {
		var app = new App();
		return expect(app.load('test/fixtures/template.html', 'empty.json'))
			.to.eventually.be.rejectedWith(Error, 'isn’t a valid array in JSON format');
	});
});
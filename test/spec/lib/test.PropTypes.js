import { expect } from 'chai';

describe('PropTypes', function() {
	var PropTypes;

	before(() => {
		PropTypes = require('../../../src/js/app/lib/PropTypes').default;
	});

	describe('chain', function() {
		it('Should take two functions and invoke them in order', function() {
			var output = '';

			function fn1() {
				output += 'fn1';
			}

			function fn2() {
				output += 'fn2';
			}

			PropTypes._chain(fn1, fn2)();

			expect(output).to.equal('fn1fn2');
		});
	});

	describe('assert', function() {
		it('Should return true with a truthy assertion', function() {
			expect(PropTypes._assert(true)).to.be.true;
		});

		it('Should throw with a falsy assertion', function() {
			expect(
				() => PropTypes._assert(false, 'propname', 'message', 'dropletname', 'droplettype')
			).to.throw(Error, 'Error in Droplet "dropletname" (droplettype) prop "propname". message');
		});
	});

	describe('isRequired', function() {
		it('Should return true when value is defined', function() {
			expect(PropTypes.isRequired('value')).to.be.true;
		});

		it('Should throw when value is undefined', function() {
			expect(() => PropTypes.isRequired()).to.throw(Error, 'Error in Droplet');
		});
	});

	describe('stringNotEmpty', function() {
		it('Should return true when value is not empty', function() {
			expect(PropTypes.stringNotEmpty('value')).to.be.true
		});

		it('Should throw when value is empty or undefined', function() {
			expect(() => PropTypes.stringNotEmpty('')).to.throw(Error, 'Error in Droplet');
			expect(() => PropTypes.stringNotEmpty()).to.throw(Error, 'Error in Droplet');
		});
	});

	describe('string', function() {
		it('Should return true when value is undefined or a string', function() {
			expect(PropTypes.string()).to.be.true;
			expect(PropTypes.string('')).to.be.true;
		});

		it('Should throw when value is not a string or undefined', function() {
			expect(() => PropTypes.string([])).to.throw(Error, 'Error in Droplet');
			expect(() => PropTypes.string({})).to.throw(Error, 'Error in Droplet');
		});
	});

	describe('object', function() {
		it('Should return true when value is an object', function() {
			expect(PropTypes.object({})).to.be.true;
			expect(PropTypes.object([])).to.be.true;
			expect(PropTypes.object(new Object)).to.be.true;
			expect(PropTypes.object(Object.create(Object.prototype))).to.be.true;
		});

		it('Should throw when value is not an object', function() {
			expect(() => PropTypes.object('')).to.throw(Error, 'Error in Droplet');
		});
	});

	describe('array', function() {
		it('Should return true when value is an array', function() {
			expect(PropTypes.array([])).to.be.true;
			expect(PropTypes.array(new Array())).to.be.true;
		});

		it('Should throw when value is not an array', function() {
			expect(() => PropTypes.array({})).to.throw(Error, 'Error in Droplet');
			expect(() => PropTypes.array('')).to.throw(Error, 'Error in Droplet');
		});
	});

	describe('arrayOf.string', function() {
		it('Should return true when value is an array of strings', function() {
			expect(PropTypes.arrayOf.string(['', ''])).to.be.true;
		});

		it('Should throw when value is not an array of strings', function() {
			expect(() => PropTypes.arrayOf.string(['', {}])).to.throw(Error, 'Error in Droplet');
			expect(() => PropTypes.arrayOf.string({one: '', two: ''})).to.throw(Error, 'Error in Droplet');
		});
	});
});
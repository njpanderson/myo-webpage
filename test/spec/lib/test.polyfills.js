import { expect } from 'chai';

import structCompare from '../../helpers/structCompare';

describe('polyfills', function() {
	before(() => {
		require('../../../src/js/app/lib/polyfills');
	});

	describe('Object.deepAssign', function() {
		describe('Sanity checking', function() {
			it('Should throw without an object', function() {
				expect(Object.deepAssign).to.throw(Error, 'Cannot convert');
			});
		});

		it('Should mutate the original object', function() {
			var ob, ob2 = {};

			ob = {
				key1: 'value1',
				key2: {
					key3: 'value3'
				}
			};

			ob2 = Object.deepAssign(ob, ob2);
			expect(ob2).to.equal(ob);
			structCompare(ob, ob2);
		});

		it('Should duplicate an object, leaving the original untouched', function() {
			var ob, ob2 = {};

			ob = {
				key1: 'value1',
				key2: {
					key3: 'value3'
				}
			};

			ob2 = Object.deepAssign({}, ob, ob2);

			expect(ob2).to.not.equal(ob);
			structCompare(ob, ob2);
		});

		it('Should should duplicate one level deep objects', function() {
			var ob, ob2 = {};

			ob = {
				key1: 'value1',
				key2: 'value2',
				key3: 'value3'
			};

			ob2 = Object.deepAssign({}, ob, ob2);

			expect(ob2).to.not.equal(ob);
			structCompare(ob, ob2);
		});

		it('Should should duplicate nested objects', function() {
			var ob, ob2 = {};

			ob = {
				key1: 'value1',
				ob_2: {
					key2: 'value2'
				},
				ob_3: {
					key3: 'value3',
					ob_4: {
						key4: 'value4',
					}
				}
			};

			ob2 = Object.deepAssign({}, ob, ob2);

			expect(ob2).to.not.equal(ob);
			structCompare(ob, ob2);
		});

		it('Should should duplicate nested arrays', function() {
			var ob, ob2 = {};

			ob = {
				key1: 'value1',
				ob_2: {
					key2: [],
					key5: [1, 2, 3, 4, 5]
				},
				ob_3: {
					key3: ['arval1', 'arval2', 'arval3'],
					ob_4: {
						key4: ['arval4', 'arval5'],
					}
				}
			};

			ob2 = Object.deepAssign({}, ob, ob2);

			expect(ob2).to.not.equal(ob);
			structCompare(ob, ob2);
		});

		it('Should should duplicate functions', function() {
			var ob, ob2 = {};

			function myfn() {
				return 'myfn';
			}

			ob = {
				key1: myfn
			};

			ob2 = Object.deepAssign({}, ob, ob2);

			expect(ob2).to.not.equal(ob);
			structCompare(ob, ob2);
		});
	});
});
function genericMockedModule(methods) {
	var module, method, invocations,
		createMethod;

	createMethod = (method) => {
		return function() {
			if (!(method in invocations)) {
				// create invocation property as array
				invocations[method] = [];
			}

			// push an invocation by method name
			invocations[method].push([...arguments]);

			// return original method shim, if necessary
			if (typeof methods[method] === 'function') {
				return methods[method].apply(this, [...arguments]);
			} else {
				return methods[method];
			}
		};
	};

	invocations = {};

	module = function() {};

	for (method in methods) {
		module.prototype[method] = createMethod(method, methods[method]);
	}

	module.prototype.__getInvocations = (method) => {
		return (invocations[method] ? invocations[method].length : 0);
	};

	module.prototype.__getInvocation = (method, index) => {
		return (invocations[method] && (invocations[method].length > index) ?
			invocations[method][index] : null);
	};

	return module;
}

export default genericMockedModule;
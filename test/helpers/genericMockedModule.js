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
		// add defined methods as prototypes of the module
		module.prototype[method] = createMethod(method, methods[method]);
	}

	/**
	 * Gets the number of invocations for a specific method.
	 */
	module.__getInvocations = (method) => {
		return (invocations[method] ? invocations[method].length : 0);
	};

	/**
	 * Gets the arguments for a specific method invocation index.
	 */
	module.__getInvocation = (method, index) => {
		return (invocations[method] && (invocations[method].length > index) ?
			invocations[method][index] : null);
	};

	/**
	 * Clears the invocation data
	 */
	module.__clearInvocations = () => {
		invocations = {};
	};

	return module;
}

export default genericMockedModule;
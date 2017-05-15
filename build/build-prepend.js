// sanity check for window/document
if (typeof window === 'undefined' ||
	typeof window.document === 'undefined' ||
	(window.document && !('createElement' in document))) {
	var error =
		'tag requires a web browser with a DOM environment to run.' +
		' Are you sure you’re in a DOM environment?' +
		' You can find out more about compiling tag with tools like Webpack in the readme:' +
		' https://github.com/njpanderson/tag';

	if (process) {
		console.warn(error);
		process.exit();
	} else {
		throw new Error(error);
	}
}
(function($) {
	console.log($);
	console.log($('.buttons a'));

	$('.buttons a').on('click', function(event) {
		event.preventDefault();
		alert(this.textContent);
	});
}(window.jQuery));
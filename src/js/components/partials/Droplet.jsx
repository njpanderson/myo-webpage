var Droplet = function() {
	return (
		<a href='#' name="{props.name}">
			{props.label}
		</a>
	);
}

Droplet.propTypes = {
	name: React.PropTypes.string,
	label: React.PropTypes.label
};

module.exports = Droplet;
const React = require('react');

class Canvas extends React.Component {
	render() {
		return (
			<div class="myo-canvas">
				<section id="template"></section>
				<section id="view">view</section>
				<section id="pallet">pallet</section>
			</div>
		);
	}
}

module.exports = Canvas;
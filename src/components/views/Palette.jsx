import React from 'react';
import PropTypes from 'prop-types';

import Droplet from './Droplet.jsx';

class Palette extends React.Component {
	constructor(props) {
		super(props);
	}

	getItems() {
		var items = [];

		if (this.props.data.palette) {
			this.props.data.palette.forEach((droplet) => {
				items.push(
					<Droplet droplet={droplet}
						active={this.props.activeDropletId === droplet.id}
						settings={this.props.settings}
						lib={this.props.lib}
						onMount={this.props.onMount}
						onEvent={this.props.onDropletEvent}
						refCollector={this.props.refCollector}
						key={droplet.id}/>
				);
			});
		}

		return items;
	}

	render() {
		return (
			<section className="palette">
				<form>
					{this.getItems.apply(this)}
				</form>
			</section>
		);
	}
}

Palette.propTypes = {
	// from PaletteContainer
	activeDropletId: PropTypes.string.isRequired,

	// from Canvas
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	lib: PropTypes.object.isRequired,
	onMount: PropTypes.func,
	onDropletEvent: PropTypes.func.isRequired,
	refCollector: PropTypes.func
};

Palette.defaultProps = {
	data: {
		palette: []
	}
};

export default Palette;
import React from 'react';
import PropTypes from 'prop-types';

import Droplet from './Droplet.jsx';

class Pallet extends React.Component {
	constructor(props) {
		super(props);
	}

	getItems() {
		var items = [];

		if (this.props.data.pallet) {
			this.props.data.pallet.forEach((droplet) => {
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
			<section className="pallet">
				<form>
					{this.getItems.apply(this)}
				</form>
			</section>
		);
	}
}

Pallet.propTypes = {
	// from PalletContainer
	activeDropletId: PropTypes.string.isRequired,

	// from Canvas
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	lib: PropTypes.object.isRequired,
	onMount: PropTypes.func,
	onDropletEvent: PropTypes.func.isRequired,
	refCollector: PropTypes.func
};

Pallet.defaultProps = {
	data: {
		pallet: []
	}
};

export default Pallet;
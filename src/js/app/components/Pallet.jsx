import React, { Component, PropTypes } from 'react';
import Droplet from './partials/Droplet.jsx';

class Pallet extends Component {
	getItems() {
		console.log(this.props.data.pallet);
		if (this.props.data.pallet && this.props.data.pallet.length) {
			return this.props.data.pallet.map(function(item, index) {
				console.log(item);
				var key = 'droplet-' + index;

				return (
					<Droplet {...item}
						onValidDrop={this.props.onPalletDrop}
						refCollector={this.props.refCollector}
						key={key}/>
				);
			}.bind(this));
		}
	}

	render() {
		return (
			<section className="pallet">
				{this.getItems.apply(this)}
			</section>
		);
	}
}

Pallet.propTypes = {
	data: PropTypes.object,
	onPalletDrop: PropTypes.func,
	refCollector: PropTypes.func
};

Pallet.defaultProps = {
	data: {
		pallet: []
	}
};

export default Pallet;
import React, { Component, PropTypes } from 'react';
import Droplet from './partials/Droplet.jsx';

class Pallet extends Component {
	getItems() {
		if (this.props.pallet && this.props.pallet.length) {
			return this.props.pallet.map(function(item, index) {
				var key = 'droplet-' + index;

				return (
					<Droplet {...item}
						onValidDrop={this.props.onValidDrop}
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
	pallet: PropTypes.arrayOf(PropTypes.object),
	onValidDrop: PropTypes.func
};

Pallet.defaultProps = {
	pallet: []
};

module.exports = Pallet;
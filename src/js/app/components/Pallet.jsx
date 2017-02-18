import React, { Component } from 'react';
import Droplet from './partials/Droplet.jsx';
import CommonPropTypes from '../assets/common-prop-types.js';

class Pallet extends Component {
	getItems() {
		var items = [], id, item, key;

		if (this.props.data.pallet) {
			for (id in this.props.data.pallet) {
				item = this.props.data.pallet[id];

				key = 'droplet-' + id;

				items.push(
					<Droplet {...item.data}
						id={id}
						state={this.props.state.pallet[id]}
						classes={this.props.classes}
						onMount={this.props.onMount}
						refCollector={this.props.refCollector}
						key={key}/>
				);
			}
		}

		return items;
	}

	render() {
		return (
			<section className="pallet">
				{this.getItems.apply(this)}
			</section>
		);
	}
}

Pallet.propTypes = CommonPropTypes;

Pallet.defaultProps = {
	data: {
		pallet: []
	}
};

export default Pallet;
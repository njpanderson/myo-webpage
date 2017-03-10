import React, { Component } from 'react';
import Droplet from './Droplet.jsx';
import { components } from '../../assets/common-prop-types.js';

class Pallet extends Component {
	constructor(props) {
		super(props);
	}

	getItems() {
		var items = [];

		if (this.props.data.pallet) {
			this.props.data.pallet.forEach((droplet) => {
				items.push(
					<Droplet {...droplet.data}
						name={droplet.name}
						dropletType={droplet.dropletType}
						id={droplet.id}
						classes={this.props.classes}
						onMount={this.props.onMount}
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
				{this.getItems.apply(this)}
			</section>
		);
	}
}

Pallet.propTypes = components;

Pallet.defaultProps = {
	data: {
		pallet: []
	}
};

export default Pallet;
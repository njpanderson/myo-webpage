import React, { Component, PropTypes } from 'react';
import Droplet from './Droplet.jsx';

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
						settings={this.props.settings}
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

Pallet.propTypes = {
	data: PropTypes.object,
	settings: PropTypes.object,
	onMount: PropTypes.func,
	refCollector: PropTypes.func
};

Pallet.defaultProps = {
	data: {
		pallet: []
	}
};

export default Pallet;
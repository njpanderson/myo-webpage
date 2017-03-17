import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';
import Droplet from '../../lib/Droplet';
import { GLYPHS, Icon } from '../../lib/Droplet';

class DropletComponent extends Component {
	constructor(props) {
		super(props);

		this.myrefs = {};
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('droplet', this.props.droplet.id);
		}
	}

	onClick(event) {
		event.preventDefault();
		this.props.onClick(event, this.props.droplet);
	}

	render() {
		var classes = [this.props.settings.classes.droplet.node];

		if (this.props.active) {
			classes.push(this.props.settings.classes.droplet.active);
		}

		return (
			<a href="#"
				id={this.props.droplet.id}
				className={classes.join(' ')}
				onClick={this.onClick}
				ref={collectRef(this.props, ['droplet'], this.props.droplet.id)}>
				<span className="label">{this.props.droplet.name}</span>
				<Icon gylph={GLYPHS.ACCOUNT_LOGIN}/>
			</a>
		);
	}
}

DropletComponent.propTypes = {
	active: PropTypes.bool,
	settings: PropTypes.object.isRequired,
	droplet: PropTypes.instanceOf(Droplet).isRequired,
	onMount: PropTypes.func,
	onClick: PropTypes.func
};

export default DropletComponent;
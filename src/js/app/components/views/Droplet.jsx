import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';

class Droplet extends Component {
	constructor(props) {
		super(props);

		this.myrefs = {};
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('droplet', this.props.id);
		}
	}

	render() {
		var classes = [this.props.settings.classes.droplet];

		return (
			<a href="#"
				id={this.props.id}
				className={classes.join(' ')}
				ref={collectRef(this.props, ['droplet'], this.props.id)}>
				<span className="label">{this.props.name}</span>
			</a>
		);
	}
}

Droplet.propTypes = {
	settings: PropTypes.object.isRequired,
	name: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string,
	attached: PropTypes.bool,
	onMount: PropTypes.func
};

export default Droplet;
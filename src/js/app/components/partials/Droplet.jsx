import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';
import CommonPropTypes from '../../assets/common-prop-types.js';

class Droplet extends Component {
	constructor() {
		super();

		this.myrefs = {};
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('droplet', this.props.id);
		}
	}

	render() {
		var classes = [this.props.classes.droplet];

		// if (this.props.state.attached) {
		// 	classes.push(this.props.classes.attached);
		// }

		return (
			<a href="#"
				name={this.props.id}
				className={classes.join(' ')}
				ref={collectRef(this.props, ['droplet'], this.props.id)}>
				{this.props.name}
			</a>
		);
	}
}

Droplet.propTypes = Object.assign({}, CommonPropTypes, {
	name: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string,
	attached: PropTypes.bool
});

export default Droplet;
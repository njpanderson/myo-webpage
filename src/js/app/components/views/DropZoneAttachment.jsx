import React, { Component, PropTypes } from 'react';

import Template from '../../lib/Template';
import Droplet from '../../lib/Droplet';

class DropZoneAttachment extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		console.log('attachment click', this.props.droplet);
	}

	render() {
		var className = 'dropzone-attachment',
			data;

		// merge edited data with droplet data
		data = Object.deepAssign({}, this.props.droplet.data, this.props.data);

		// set classname
		className += ' ' + this.props.droplet.dropletType;

		return (
			<span
				className={className}
				onClick={this.onClick}>
				{Template.renderDroplet(this.props.droplet, data)}
			</span>
		);
	}
}

DropZoneAttachment.propTypes = {
	droplet: PropTypes.instanceOf(Droplet),
	data: PropTypes.object,
};

export default DropZoneAttachment;
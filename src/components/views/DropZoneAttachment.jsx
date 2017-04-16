import React from 'react';
import PropTypes from 'prop-types';

import Template from '../../lib/Template';
import Droplet from '../../lib/Droplet';
import DropZone from '../../lib/DropZone';

class DropZoneAttachment extends React.Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(event) {
		event.preventDefault();

		this.props.onClick(
			event,
			this.props.droplet,
			this.props.attachmentIndex
		);
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
				{Template.renderDroplet(this.props.droplet, data, this.props.zone, false)}
			</span>
		);
	}
}

DropZoneAttachment.propTypes = {
	droplet: PropTypes.instanceOf(Droplet).isRequired,
	zone: PropTypes.instanceOf(DropZone).isRequired,
	attachmentIndex: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
};

export default DropZoneAttachment;
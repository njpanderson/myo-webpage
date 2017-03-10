import React, { Component, PropTypes } from 'react';

import Template from '../../lib/Template';

class DropZoneAttachments extends Component {
	constructor(props) {
		super(props);
	}

	renderActiveAttachments() {
		var children = [];

		this.props.activeAttachments.forEach((attachment, index) => {
			children.push(this.renderAttachmentIntoDropzone(
				this.props.class_ui.getDropletById(attachment.droplet_id),
				attachment.droplet_id + '-attachment-' + index,
				attachment.data
			));
		});

		return children;
	}

	renderAttachmentIntoDropzone(droplet, key, edited_data) {
		console.group('renderDropletInDropzone');

		// merge edited data with droplet data
		var data = Object.deepAssign({}, droplet.data, edited_data);

		console.log('droplet', droplet);
		console.log('edited_data', edited_data);
		console.log('data', data);

		console.groupEnd();
		return (
			<span
				key={key}
				className="dropzone-attachment">
				{Template.renderDroplet(droplet, data)}
			</span>
		);
	}

	render() {
		return (
			<span
				className="attachments">
				{this.renderActiveAttachments()}
			</span>
		);
	}
}

DropZoneAttachments.propTypes = {
	activeAttachments: PropTypes.array,
	class_ui: PropTypes.object.isRequired,
};

export default DropZoneAttachments;
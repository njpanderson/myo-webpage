import React, { Component, PropTypes } from 'react';

import DropZone from '../../lib/DropZone';
import DropZoneAttachment from './DropZoneAttachment.jsx';

class DropZoneAttachmentList extends Component {
	constructor(props) {
		super(props);

		this.attachmentClick = this.attachmentClick.bind(this);
	}

	attachmentClick(event, droplet, attachmentIndex) {
		if (typeof this.props.onAttachmentClick === 'function') {
			this.props.onAttachmentClick(droplet, this.props.zone, attachmentIndex);
		}
	}

	renderActiveAttachments() {
		var children = [];

		this.props.activeAttachments.forEach((attachment, index) => {
			children.push(
				<DropZoneAttachment
					key={attachment.droplet_id + '-attachment-' + index}
					attachmentIndex={index}
					onClick={this.attachmentClick}
					droplet={this.props.lib.getDropletById(attachment.droplet_id)}
					zone={this.props.zone}
					data={attachment.data}/>
			);
		});

		return children;
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

DropZoneAttachmentList.propTypes = {
	zone: PropTypes.instanceOf(DropZone).isRequired,
	activeAttachments: PropTypes.array.isRequired,
	onAttachmentClick: PropTypes.func.isRequired,
	lib: PropTypes.object.isRequired
};

export default DropZoneAttachmentList;
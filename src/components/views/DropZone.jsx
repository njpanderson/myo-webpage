import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';
import DropZone from '../../lib/DropZone';
import DropZoneAttachment from './DropZoneAttachment.jsx';

class DropZoneComponent extends Component {
	constructor(props) {
		super(props);

		this.myrefs = {};
		this.attachmentClick = this.attachmentClick.bind(this);
		this.onEvent = this.onEvent.bind(this);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('dropzone', this.props.zone.id);
		}
	}

	onEvent(event) {
		if (event.type === 'click') {
			event.preventDefault();
		}

		this.props.onEvent(event, this.props.zone);
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
					droplet={this.props.class_ui.getDropletById(attachment.droplet_id)}
					zone={this.props.zone}
					data={attachment.data}/>
			);
		});

		return children;
	}

	render() {
		var key = this.props.zone.id + '-zone',
			target_key = this.props.zone.id + '-target',
			dropzone_class = [this.props.settings.classes.dropzone.node],
			target_class;

		target_class = (this.props.activeAttachments.length < this.props.zone.maxAttachments) ?
			this.props.settings.classes.dropzone_target :
			this.props.settings.classes.dropzone_target + ' ' + this.props.settings.classes.hidden;

		if (this.props.className !== '') {
			dropzone_class.push(this.props.className);
		}

		return (
			<span
				key={key}
				className={dropzone_class.join(' ')}
				ref={collectRef(this.props, ['dropzone'], this.props.zone.id)}
				data-id={this.props.zone.id}
				data-attachment={this.props.zone.attachmentId}>
				<span
					className="attachments">
					{this.renderActiveAttachments()}
				</span>
				<span className="target-outer">
					<span key={target_key}
						onClick={this.onEvent}
						ref={collectRef(this.props, ['dropzone_target'], this.props.zone.id)}
						className={target_class}>
							<b>{this.props.settings.dropZone.label}</b>
						</span>
				</span>
			</span>
		);
	}
}

DropZoneComponent.propTypes = {
	zone: PropTypes.instanceOf(DropZone).isRequired,
	className: PropTypes.string,
	settings: PropTypes.object.isRequired,
	activeAttachments: PropTypes.array.isRequired,
	onMount: PropTypes.func.isRequired,
	onAttachmentClick: PropTypes.func.isRequired,
	onEvent: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	class_ui: PropTypes.object.isRequired
};

export default DropZoneComponent;
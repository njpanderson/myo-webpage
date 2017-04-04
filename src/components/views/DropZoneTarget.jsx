import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';
import DropZone from '../../lib/DropZone';

class DropZoneTarget extends Component {
	constructor(props) {
		super(props);

		this.onEvent = this.onEvent.bind(this);
	}

	shouldComponentUpdate(props) {
		return (
			props.activeAttachments.length != this.props.activeAttachments.length
		);
	}

	onEvent(event) {
		if (event.type === 'click') {
			event.preventDefault();
		}

		this.props.onEvent(event, this.props.zone);
	}

	render() {
		var key = this.props.zone.id + '-target',
			classNames = [this.props.settings.classes.dropzone_target];

		if (this.props.activeAttachments.length >= this.props.zone.maxAttachments) {
			classNames.push(this.props.settings.classes.hidden);
		}

		return (
			<span className="target-outer">
				<span key={key}
					onClick={this.onEvent}
					ref={collectRef(this.props, ['dropzone_target'], this.props.zone.id)}
					className={classNames.join(' ')}>
						<b>{this.props.settings.dropZone.label}</b>
					</span>
			</span>
		);
	}
}

DropZoneTarget.propTypes = {
	zone: PropTypes.instanceOf(DropZone).isRequired,
	settings: PropTypes.object.isRequired,
	activeAttachments: PropTypes.array.isRequired,
	onEvent: PropTypes.func.isRequired,
	refCollector: PropTypes.func
};

export default DropZoneTarget;
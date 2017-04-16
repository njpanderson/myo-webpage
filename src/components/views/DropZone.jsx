import React from 'react';
import PropTypes from 'prop-types';

import { collectRef } from '../../lib/utils';
import DropZone from '../../lib/DropZone';
import DropZoneAttachmentList from './DropZoneAttachmentList.jsx';
import DropZoneTarget from './DropZoneTarget.jsx';

class DropZoneComponent extends React.Component {
	constructor(props) {
		super(props);

		this.myrefs = {};
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

	render() {
		var key = this.props.zone.id + '-zone',
			classNames = [this.props.settings.classes.dropzone.node];

		if (this.props.className !== '') {
			classNames.push(this.props.className);
		}

		return (
			<span
				key={key}
				className={classNames.join(' ')}
				ref={collectRef(this.props, ['dropzone'], this.props.zone.id)}
				data-id={this.props.zone.id}
				data-attachment={this.props.zone.attachmentId}>
				<DropZoneAttachmentList
					zone={this.props.zone}
					activeAttachments={this.props.activeAttachments}
					onAttachmentClick={this.props.onAttachmentClick}
					lib={this.props.lib}/>
				<DropZoneTarget
					zone={this.props.zone}
					settings={this.props.settings}
					activeAttachments={this.props.activeAttachments}
					refCollector={this.props.refCollector}
					onEvent={this.onEvent}/>
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
	lib: PropTypes.object.isRequired
};

export default DropZoneComponent;
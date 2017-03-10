import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';
import DropZoneAttachments from './DropZoneAttachments.jsx';

class DropZone extends Component {
	constructor(props) {
		super(props);

		this.myrefs = {};
	}

	componentDidMount() {
		console.log('DropZone mounted!');
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('dropzone', this.props.id);
		}
	}

	// shouldComponentUpdate() {
	// 	return false;
	// }

	render() {
		var key = this.props.id + '-zone',
			target_key = this.props.id + '-target';

		return (
			<span
				key={key}
				className={this.props.className}
				data-id={this.props.id}
				data-attachment={this.props.attachment}
				ref={collectRef(this.props, ['dropzone'], this.props.id)}>
				<DropZoneAttachments
					activeAttachments={this.props.activeAttachments}
					class_ui={this.props.class_ui}/>
				<span key={target_key}
					className="target">{this.props.zoneLabel}</span>
			</span>
		);
	}
}

DropZone.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	attachment: PropTypes.string,
	zoneLabel: PropTypes.string,
	activeAttachments: PropTypes.array,
	class_ui: PropTypes.object,
	onMount: PropTypes.func,
	refCollector: PropTypes.func
};

export default DropZone;
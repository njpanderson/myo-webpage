import React, { Component, PropTypes } from 'react';

import { collectRef } from '../../lib/utils';
import DropZone from './DropZone.jsx';

class Template extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('template');
		}
	}

	rawMarkup(html) {
		return { __html: html };
	}

	/**
	 * Uses state (from props.zones) to ascertain the attachments
	 */
	getZoneAttachments(dropzone_id) {
		var zone,
			attachments = [];

		if (this.props.zones && (zone = this.props.zones[dropzone_id])) {
			attachments = zone.attachments;
		}

		return attachments;
	}

	getTemplate() {
		var children = [];

		this.props.template.forEach((node, index) => {
			var key;

			switch (node.type) {
			case 'text':
				key = 'fragment-' + index;

				children.push(
					<span
						key={key}
						className={this.props.settings.classes.component}>{node.content}</span>
				);
				break;

			case 'dropzone':
				children.push(
					<DropZone
						key={node.id}
						id={node.id}
						className={this.props.settings.classes.dropzone}
						zoneLabel={this.props.settings.dropZone.label}
						activeAttachments={this.getZoneAttachments(node.id)}
						class_ui={this.props.class_ui}
						attachment={node.attachment}
						refCollector={this.props.refCollector}
						onMount={this.props.onMount}/>
				);
				break;
			}
		});

		return children;
	}

	render() {
		return (
			<section className="template"
				ref={collectRef(this.props, 'template')}>
				<pre>
					<code className="html"
						ref={collectRef(this.props, 'template_inner')}>
						{this.getTemplate()}
					</code>
				</pre>
			</section>
		);
	}
}

Template.propTypes = {
	settings: PropTypes.object.isRequired,
	template: PropTypes.array.isRequired,
	onMount: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	class_ui: PropTypes.object.isRequired
};

Template.defaultProps = {
	template: ''
};

export default Template;
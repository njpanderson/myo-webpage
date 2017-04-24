import React from 'react';
import PropTypes from 'prop-types';

import { collectRef } from '../../lib/utils';
import DropZone from './DropZone.jsx';
import { Icon, dropletTypeToGlyphs } from './Icon.jsx';

class Template extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('template');
		}
	}

	/**
	 * Uses state (from props.zones) to ascertain the attachments
	 */
	getZoneAttachments(dropzone_id) {
		if (this.props.zones && this.props.zones[dropzone_id]) {
			return this.props.zones[dropzone_id].attachments;
		} else {
			return [];
		}
	}

	/**
	 * @description
	 * Computes the correct potential className for the drop zone based on:
	 * - The active Droplet ID
	 * - Whether or not this drop zone will accept the droplet
	 */
	getDropZoneClassNames(dropzone) {
		var classes = [],
			droplet;

		if (this.props.activeDropletID !== '' &&
			(droplet = this.props.lib.getDropletById(this.props.activeDropletID))) {
			classes.push(this.props.settings.classes.dropzone.possible_target);
			classes.push(
				this.props.settings.classes.dropzone[
					(
						this.props.lib.isValidDrop(droplet, dropzone) ?
						'will_accept' : 'will_decline'
					)
				]
			);

			return classes;
		} else {
			return [];
		}
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
						key={node.zone.id}
						zone={node.zone}
						className={this.getDropZoneClassNames(node.zone).join(' ')}
						settings={this.props.settings}
						activeAttachments={this.getZoneAttachments(node.zone.id)}
						refCollector={this.props.refCollector}
						onMount={this.props.onMount}
						onEvent={this.props.onDropZoneEvent}
						onAttachmentClick={this.props.onAttachmentClick}
						lib={this.props.lib}/>
				);
				break;
			}
		});

		return children;
	}

	getInstruction() {
		var className = [
				this.props.settings.classes.instruction
			], droplet;

		if (this.props.activeDropletID != '' &&
			(droplet = this.props.lib.getDropletById(this.props.activeDropletID))) {
			className.push(droplet.dropletType);

			return (
				<div className={className.join(' ')}>
					<h2>
						<Icon glyph={dropletTypeToGlyphs[droplet.dropletType]}/>
						<span>{droplet.name}</span>
					</h2>
					<p><b>Choose a target</b> for the selected droplet below.</p>
				</div>
			);
		}
	}

	render() {
		return (
			<section className={this.props.settings.classes.template.node}
				ref={collectRef(this.props, 'template')}>
				{this.getInstruction()}
				<div className={this.props.settings.classes.template.inner}>
					<pre>
						<code className="html"
							ref={collectRef(this.props, 'template_inner')}>
							{this.getTemplate()}
						</code>
					</pre>
				</div>
			</section>
		);
	}
}

Template.propTypes = {
	// from TemplateContainer
	zones: PropTypes.object.isRequired,
	activeDropletID: PropTypes.string,

	// from Canvas
	settings: PropTypes.object.isRequired,
	template: PropTypes.array.isRequired,
	onMount: PropTypes.func.isRequired,
	onAttachmentClick: PropTypes.func.isRequired,
	onDropZoneEvent: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	lib: PropTypes.object.isRequired
};

Template.defaultProps = {
	template: ''
};

export default Template;
import React from 'react';
import PropTypes from 'prop-types';

import { collectRef } from '../../lib/utils';
import Droplet from '../../lib/Droplet';
import Template from '../../lib/Template';
import { GLYPHS, Icon, dropletTypeToGlyphs } from './Icon.jsx';

class DropletComponent extends React.Component {
	constructor(props) {
		super(props);

		this.tooltip_cache = '';
		this.ui = {
			droplet: null
		};

		this.onEvent = this.onEvent.bind(this);
	}

	refCollector(ref) {
		var collector = collectRef(this.props, ['droplet'], this.props.droplet.id);
		this.ui.droplet = ref;
		collector(ref);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('droplet', this.props.droplet.id);
		}
	}

	onEvent(event) {
		if (event.type === 'click') {
			event.preventDefault();
		}

		if (event.type === 'mouseenter' || event.type === 'touchstart') {
			if (this.tooltip_cache === '') {
				this.tooltip_cache +=
					'<code>' +
					Template.entities(
						Template.renderDroplet(
							this.props.droplet,
							this.props.droplet.data,
							null,
							false
						)
					) +
					'</code>';

				if (this.props.droplet.guidance) {
					this.tooltip_cache += this.props.droplet.guidance;
				}

				this.tooltip_cache += '<p>' +
					('ontouchstart' in window ? 'Tap' : 'Click') +
					' on the Droplet to place it in the template.</p>';
			}
		}

		this.props.onEvent(event, this.props.droplet, {
			ref: this.ui.droplet,
			title: this.props.droplet.name,
			content: this.tooltip_cache,
			iconGlyph: GLYPHS.LIGHTBULB
		});
	}

	showDescription(show=true) {
		console.log('showDescription', this.props.droplet.id, show);
	}

	render() {
		var classes = [
			this.props.settings.classes.droplet.node,
			'type-' + this.props.droplet.dropletType
		];

		if (this.props.active) {
			classes.push(this.props.settings.classes.droplet.active);
		}

		return (
			<button
				id={this.props.droplet.id}
				className={classes.join(' ')}
				onClick={this.onEvent}
				onMouseEnter={this.onEvent}
				onMouseLeave={this.onEvent}
				onTouchStart={this.onEvent}
				onTouchEnd={this.onEvent}
				ref={this.refCollector.bind(this)}>
				<span className="label">
					<Icon glyph={dropletTypeToGlyphs[this.props.droplet.dropletType]}/>
					{this.props.droplet.name}
				</span>
			</button>
		);
	}
}

DropletComponent.propTypes = {
	active: PropTypes.bool,
	settings: PropTypes.object.isRequired,
	lib: PropTypes.object.isRequired,
	refCollector: PropTypes.func.isRequired,
	droplet: PropTypes.instanceOf(Droplet).isRequired,
	onMount: PropTypes.func,
	onEvent: PropTypes.func
};

export default DropletComponent;
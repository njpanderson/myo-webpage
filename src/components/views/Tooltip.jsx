import React, { Component, PropTypes } from 'react';

import { Icon } from '../views/Icon.jsx';
import { rawMarkup } from '../../lib/utils';

class Tooltip extends Component {
	constructor(props) {
		super(props);

		this.popper = null;
		this.ui = {
			tooltip: null
		};
	}

	refCollector(ref) {
		this.ui.tooltip = ref;
	}

	componentDidMount() {
		this.updateAttachment();
	}

	componentDidUpdate() {
		this.updateAttachment();
	}

	updateAttachment() {
		var options;

		if (this.props.state.show) {
			// merge default options with those assigned via the state change
			options = Object.deepAssign({}, {
				placement: 'top',
				modifiers: {
					flip: ['top', 'bottom'],
					arrow: {
						element: '.arrow'
					}
				}
			}, this.props.state.options);

			this.popper = this.props.attacher(this.props.state.attachment, this.ui.tooltip, options);
		} else {
			if (this.popper) {
				this.popper.destroy();
				this.popper = null;
			}
		}
	}

	render() {
		var classes, icon;

		classes = [
			this.props.settings.classes.popup,
			this.props.settings.classes.tooltip
		];

		if (!this.props.state.show) {
			classes.push(this.props.settings.classes.hidden);
		} else {
			if (this.props.state.iconGlyph) {
				icon = <Icon glyph={this.props.state.iconGlyph}/>;
			}
		}

		return (
			<div
				ref={this.refCollector.bind(this)}
				className={classes.join(' ')}>
				<div className="content">
					<h2>
						{icon}
						<span>{this.props.state.title}</span>
					</h2>
					<div dangerouslySetInnerHTML={rawMarkup(this.props.state.content)}/>
				</div>
				<span className="arrow"/>
			</div>
		);
	}
}

Tooltip.propTypes = {
	settings: PropTypes.object.isRequired,
	attacher: PropTypes.func.isRequired,
	state: PropTypes.object.isRequired
};

export default Tooltip;
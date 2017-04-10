import React, { Component, PropTypes } from 'react';

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
		if (this.props.show) {
			this.popper = this.props.attacher(this.props.attachment, this.ui.tooltip, {
				placement: 'top',
				modifiers: {
					flip: ['top', 'bottom'],
					arrow: {
						element: '.arrow'
					}
				}
			});
		} else {
			if (this.popper) {
				this.popper.destroy();
				this.popper = null;
			}
		}
	}

	render() {
		var classes;

		classes = [
			this.props.settings.classes.popup,
			this.props.settings.classes.tooltip
		];

		if (!this.props.show) {
			classes.push(this.props.settings.classes.hidden);
		}

		return (
			<div
				ref={this.refCollector.bind(this)}
				className={classes.join(' ')}>
				<div className="content"
					dangerouslySetInnerHTML={rawMarkup(this.props.content)}/>
				<span className="arrow"/>
			</div>
		);
	}
}

Tooltip.propTypes = {
	settings: PropTypes.object.isRequired,
	attacher: PropTypes.func.isRequired,
	show: PropTypes.bool.isRequired,
	attachment: PropTypes.object,
	content: PropTypes.string
};

export default Tooltip;
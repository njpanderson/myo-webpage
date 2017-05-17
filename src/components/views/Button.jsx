import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from './Icon.jsx';

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	buttonClick(event) {
		event.target.blur();
		this.props.lib.handlers.buttonClick(event.target, event);

		if (typeof this.props.onClick === 'function') {
			this.props.onClick(event);
		}
	}

	render() {
		var type = (this.props.type === 'submit') ? 'submit' : 'button',
			classes = ['button', this.props.className],
			icon;

		if (this.props.type === 'cancel') {
			classes.push('cancel');
		} else if (this.props.type === 'submit') {
			classes.push('primary');
		}

		if (this.props.icon) {
			icon = (
				<Icon glyph={this.props.icon}
					width={14}
					height={14}/>
			);
		}

		return (
			<button
				// ref={props.refCollector}
				className={classes.join(' ')}
				onClick={this.buttonClick.bind(this)}
				type={type}>
				<span>
					{icon || null}
					{this.props.label}
					<span className="circle"></span>
				</span>
			</button>
		);
	}
}

Button.propTypes = {
	type: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	icon: PropTypes.string,
	className: PropTypes.string,
	onClick: PropTypes.func,
	refCollector: PropTypes.func,
	lib: PropTypes.object.isRequired
};

export default Button;
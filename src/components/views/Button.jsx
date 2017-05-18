import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from './Icon.jsx';

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	buttonClick(event) {
		event.target.blur();
		this.animateButtonClick(event.target, event);

		if (typeof this.props.onClick === 'function') {
			this.props.onClick(event);
		}
	}

	/**
	 * Animates the 'click' effect on a button
	 * @param {HTMLElement} button - The button being clicked.
	 * @param {ReactEvent} event - The event object.
	 */
	animateButtonClick(button, event) {
		var offset = {},
			rect, circle;

		if (button && event && event.pageX && event.pageY &&
			(circle = button.querySelector(this.props.settings.selectors.button_circle))) {
			// get metrics and offset by scroll
			rect = button.getBoundingClientRect();
			rect.leftScrolled = rect.left + window.pageXOffset;
			rect.topScrolled = rect.top + window.pageYOffset;

			// calculate cursor offset on the button
			offset.left = event.pageX - (rect.left + window.pageXOffset);
			offset.top = event.pageY - (rect.top + window.pageYOffset);

			// position the circle based on the pointer position on the button
			circle.classList.remove(this.props.settings.classes.button_animate);
			circle.style.left = offset.left - (circle.offsetWidth / 2) + 'px';
			circle.style.top = offset.top - (circle.offsetHeight / 2) + 'px';
			circle.classList.add(this.props.settings.classes.button_animate);
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
				ref={this.props.refCollector}
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
	settings: PropTypes.object
};

export default Button;
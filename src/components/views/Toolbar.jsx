import React, { Component, PropTypes } from 'react';

import { Icon } from './Icon.jsx';

class Toolbar extends Component {
	constructor(props) {
		super(props);
	}

	registerButtonClick(button) {
		return function(event) {
			var args = button.arguments || [];

			event.preventDefault();

			if (typeof button.method === 'string' &&
				this.props.class_app[button.method]) {
				// method is a defined App method (as a string)
				this.props.class_app[button.method].apply(this.props.class_app, args);
			} else {
				// method is a custom function. call with app context (unless bound elsewhere)
				button.method.apply(this.props.class_app, args);
			}
		}.bind(this);
	}

	getToolbarButtons() {
		var buttons = [];

		if (this.props.buttons && this.props.buttons.length) {
			this.props.buttons.forEach((button, index) => {
				var key = 'button-' + index,
					icon;

				if (button.icon) {
					icon = (
						<Icon glyph={button.icon}/>
					);
				}

				buttons.push(
					<li key={key}>
						<a href="#"
							onClick={this.registerButtonClick(button)}>
							{icon}
							{button.label}
						</a>
					</li>
				);
			});

			return buttons;
		}
	}

	render() {
		return (
			<menu className="toolbar">
				<ul>
					{this.getToolbarButtons()}
				</ul>
			</menu>
		);
	}
}

Toolbar.propTypes = {
	buttons: PropTypes.arrayOf(PropTypes.object),
	class_app: PropTypes.object.isRequired
};

export default Toolbar;
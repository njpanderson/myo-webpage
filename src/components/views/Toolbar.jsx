import React, { Component, PropTypes } from 'react';

import { Icon } from './Icon.jsx';

class Toolbar extends Component {
	constructor(props) {
		super(props);

		this.buttonRefs = {};
	}

	registerButtonClick(button, key) {
		return function(event) {
			var args = button.arguments || [];

			event.preventDefault();

			if (this.buttonRefs) {
				this.buttonRefs[key].blur();
			}

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

	registerButtonRef(key) {
		return function(ref) {
			if (ref !== null) {
				this.buttonRefs[key] = ref;
			}
		}.bind(this);
	}

	getToolbarButtons() {
		var buttons = [];

		if (this.props.buttons && this.props.buttons.length) {
			this.props.buttons.forEach((button, index) => {
				var key = 'button-' + index,
					classes = [button.className || ''],
					icon;

				if (button.icon) {
					icon = (
						<Icon glyph={button.icon}/>
					);
				}

				if (button.separator) {
					classes.push(this.props.settings.classes.toolbar.separator);
				}

				buttons.push(
					<li key={key}
						className={classes.join(' ')}>
						<a href="#"
							ref={this.registerButtonRef(key)}
							onClick={this.registerButtonClick(button, key)}>
							<span>
								{icon}
								{button.label}
							</span>
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
	settings: PropTypes.object.isRequired,
	class_app: PropTypes.object.isRequired
};

export default Toolbar;
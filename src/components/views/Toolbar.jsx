/**
 * @typedef ToolbarStateSegment
 * @description
 * A small segment of the App's internal state which includes values relevant to toolbar
 * button production.
 * @property {object} UI
 * @property {object} UI.dialog
 * @property {module:assets/constants.dialogModes} UI.dialog.mode - The current mode of the active dialog.
 * @property {number|null} tour_stage - The current tour stage index. (Or `null`).
 */

/**
 * A toolbar label function will be invoked with the following arguments:
 * @typedef {function} ToolbarItemLabel
 * @param {ToolbarStateSegment} state - A segment of the current application state.
 */

/**
 * @typedef ToolbarItem
 * @property {ToolbarItemLabel|string} label - The toolbar label. Either a function or a literal string.
 * @property {module:components/views/Icon.GLYPHS} glyph - The icon glyph to use.
 * @property {string} method - The App method to invoke when the buttons is pressed.
 * @property {string} className - Extra class name(s) to apply to the button.
 * @property {boolean} separator=false - Produce a separator to the left of the button.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from './Icon.jsx';

class Toolbar extends React.Component {
	constructor(props) {
		super(props);

		this.buttonRefs = {};
	}

	registerButtonClick(button, key) {
		return function(event) {
			var args = button.arguments || [];

			event.preventDefault();

			if (this.buttonRefs && this.buttonRefs[key]) {
				this.buttonRefs[key].blur();
				this.props.onButtonClick(this.buttonRefs[key], event);
			}

			if (typeof button.method === 'string' &&
				this.props.lib.tools[button.method]) {
				// method is a defined App method (as a string)
				this.props.lib.tools[button.method].apply(null, args);
			} else {
				// method is a custom function. call with app context (unless bound elsewhere)
				button.method.apply(null, args);
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
					classes = [],
					icon, label;

				if (button.icon) {
					icon = (
						<Icon glyph={button.icon}
							width={14}
							height={14}/>
					);
				}

				if (button.className) {
					classes.push(button.className);
				}

				if (button.separator) {
					classes.push(this.props.settings.classes.toolbar.separator);
				}

				if (typeof button.label === 'function') {
					label = button.label({
						UI: {
							dialog: {
								mode: this.props.dialog_mode
							},
							tour_stage: this.props.tour_stage,
						}
					});
				} else {
					label = button.label;
				}

				buttons.push(
					<li key={key}
						className={classes.join(' ')}>
						<button
							className={this.props.settings.classes.button}
							ref={this.registerButtonRef(key)}
							onClick={this.registerButtonClick(button, key)}>
							<span>
								{icon}
								{label}
								<span className="circle"></span>
							</span>
						</button>
					</li>
				);
			});

			return buttons;
		}
	}

	render() {
		return (
			<menu className="toolbar">
				<form>
					<ul>
						{this.getToolbarButtons()}
					</ul>
				</form>
			</menu>
		);
	}
}

Toolbar.propTypes = {
	buttons: PropTypes.arrayOf(PropTypes.object),
	tour_stage: PropTypes.any,
	dialog_mode: PropTypes.string,
	settings: PropTypes.object.isRequired,
	onButtonClick: PropTypes.func,
	lib: PropTypes.object.isRequired
};

export default Toolbar;
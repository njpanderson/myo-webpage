import React, { Component, PropTypes } from 'react';

import { dialogModes } from '../../assets/constants';

// import the dialogs used, then put into a global for referencing
import DialogGeneral from '../dialogs/DialogGeneral.jsx';
import DialogEditDroplet from '../dialogs/DialogEditDroplet.jsx';

var DialogComponents = {};
DialogComponents[dialogModes.EDIT_DROPLET] = DialogEditDroplet;
DialogComponents[dialogModes.GENERAL] = DialogGeneral;

class Dialog extends Component {
	constructor(props) {
		super(props);
	}

	/**
	 * `ref` and `popper` reference is refreshed here instead of componentDidMount
	 * because this component doesn't really "unmount" as such - it just changes the
	 * inner `Component` value for dialog contents.
	 */
	collectRef(ref) {
		if (ref !== null) {
			this.dialogRef = ref;

			if (this.popper) {
				// popper already exists - remove and set null
				this.popper.destroy();
				this.popper = null;
			}

			if (this.props.data && this.props.data.attachment) {
				// attachment data exists - apply with popper
				this.popper = this.props.class_ui._setUIAttachment(
					this.props.data.attachment,
					this.dialogRef
				);
			}
		}
	}

	render() {
		var Component,
			classes = [this.props.settings.classes.dialog.main];

		if (this.props.mode !== dialogModes.NONE) {
			classes.push(this.props.settings.classes.dialog.visible);
		}

		// get appropriate component for dialog mode
		Component = DialogComponents[this.props.mode];

		if (Component) {
			// a dialog is being requested - render the appropriate component
			if (this.props.data.overlay === false) {
				classes.push(this.props.settings.classes.dialog.no_overlay);
			}

			return (
				<div className={classes.join(' ')}>
					<Component
						key={this.props.id}
						data={this.props.data}
						settings={this.props.settings}
						refCollector={this.collectRef.bind(this)}
						class_template={this.props.class_template}
						onDialogComplete={this.props.onDialogComplete}
						onDialogCancel={this.props.onDialogCancel}
						onButtonClick={this.props.onButtonClick}
						class_ui={this.props.class_ui}/>
				</div>
			);
		} else {
			return (
				<div className={classes.join(' ')}></div>
			);
		}
	}
}

Dialog.propTypes = {
	// from DialogContainer
	mode: PropTypes.string,
	data: PropTypes.object,
	onDialogCancel: PropTypes.func,
	onButtonClick: PropTypes.func,
	id: PropTypes.string.isRequired,

	// from Canvas
	settings: PropTypes.object,
	onDialogComplete: PropTypes.func,
	class_ui: PropTypes.object,
	class_template: PropTypes.object
};

Dialog.defaultProps = {};

export default Dialog;
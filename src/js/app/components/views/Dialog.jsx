import React, { PropTypes } from 'react';

import { dialogModes } from '../../assets/constants';

// import the dialogs used, then put into a global for referencing
import DialogEditDroplet from '../dialogs/DialogEditDroplet.jsx';

var DialogComponents = {};
DialogComponents[dialogModes.EDIT_DROPLET] = DialogEditDroplet;

function Dialog(props) {
	var Component,
		classes = [props.settings.classes.dialog.main];

	if (props.mode !== dialogModes.NONE) {
		classes.push(props.settings.classes.dialog.visible);
	}

	// get appropriate component for dialog mode
	Component = DialogComponents[props.mode];

	if (Component) {
		return (
			<div className={classes.join(' ')}>
				<Component
					class_ui={props.class_ui}
					class_template={props.class_template}
					state={props.state}
					onDialogComplete={props.onDialogComplete}
					onDialogCancel={props.onDialogCancel}/>
			</div>
		);
	} else {
		return (
			<div className={classes.join(' ')}></div>
		);
	}
}

Dialog.propTypes = {
	mode: PropTypes.string,
	settings: PropTypes.object,
	state: PropTypes.object,
	onDialogComplete: PropTypes.func,
	onDialogCancel: PropTypes.func,
	class_ui: PropTypes.object,
	class_template: PropTypes.object
};

Dialog.defaultProps = {};

export default Dialog;
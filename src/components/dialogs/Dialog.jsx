import React, { PropTypes } from 'react';

import { dialogModes } from '../../assets/constants';

// import the dialogs used, then put into a global for referencing
import DialogGeneral from '../dialogs/DialogGeneral.jsx';
import DialogEditDroplet from '../dialogs/DialogEditDroplet.jsx';

var DialogComponents = {};
DialogComponents[dialogModes.EDIT_DROPLET] = DialogEditDroplet;
DialogComponents[dialogModes.GENERAL] = DialogGeneral;

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
					data={props.data}
					settings={props.settings}
					class_template={props.class_template}
					onDialogComplete={props.onDialogComplete}
					onDialogCancel={props.onDialogCancel}
					class_ui={props.class_ui}/>
			</div>
		);
	} else {
		return (
			<div className={classes.join(' ')}></div>
		);
	}
}

Dialog.propTypes = {
	// from DialogContainer
	mode: PropTypes.string,
	data: PropTypes.object,

	// from Canvas
	settings: PropTypes.object,
	onDialogComplete: PropTypes.func,
	onDialogCancel: PropTypes.func,
	class_ui: PropTypes.object,
	class_template: PropTypes.object
};

Dialog.defaultProps = {};

export default Dialog;
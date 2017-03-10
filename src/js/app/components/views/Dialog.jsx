import React, { PropTypes } from 'react';

import { components } from '../../assets/common-prop-types.js';
import { dialogModes } from '../../assets/constants.js';

import DialogEditDroplet from '../dialogs/DialogEditDroplet.jsx';

var DialogComponents = {};
DialogComponents[dialogModes.EDIT_DROPLET] = DialogEditDroplet;

function Dialog(props) {
	var Component,
		classes = [props.settings.classes.dialog.main];

	if (props.mode !== dialogModes.NONE) {
		classes.push(props.settings.classes.dialog.visible);
	}

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

Dialog.propTypes = Object.assign(components, {
	onDialogComplete: PropTypes.func,
	onDialogCancel: PropTypes.func
});

Dialog.defaultProps = {};

export default Dialog;
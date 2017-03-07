import React, { PropTypes } from 'react';

import CommonPropTypes from '../../assets/common-prop-types.js';
import { dialogModes } from '../../assets/constants.js';

import DialogEditDroplet from '../dialogs/DialogEditDroplet.jsx';

var DialogComponents = {};
DialogComponents[dialogModes.EDIT_DROPLET] = DialogEditDroplet;

function Dialog(props) {
	var Component,
		classes = [props.settings.classes.dialog.main];

	if (props.state.dialog.mode !== dialogModes.NONE) {
		classes.push(props.settings.classes.dialog.visible);
	}

	Component = DialogComponents[props.state.dialog.mode];

	if (Component) {
		return (
			<div className={classes.join(' ')}>
				<Component
					class_ui={props.class_ui}
					class_template={props.class_template}
					state={props.state.dialog.state}
					onDialogComplete={props.onDialogComplete}
					onDialogCancel={props.onDialogClose}/>
			</div>
		);
	} else {
		return (
			<div className={classes.join(' ')}></div>
		);
	}
}

Dialog.propTypes = Object.assign(CommonPropTypes, {
	onDialogComplete: PropTypes.func,
	onDialogCancel: PropTypes.func
});

Dialog.defaultProps = {};

export default Dialog;
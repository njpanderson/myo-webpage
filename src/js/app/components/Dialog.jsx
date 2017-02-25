import React, { Component, PropTypes } from 'react';

import CommonPropTypes from '../assets/common-prop-types.js';
import { dialogModes } from '../assets/constants.js';

import DialogEditDroplet from './dialogs/DialogEditDroplet.jsx';

/**
 * Just an empty dialog for fallback purposes
 */
class Empty extends Component {
	constructor() {
		super();
	}

	render() {
		return (<div></div>);
	}
}

class Dialog extends Component {
	constructor() {
		super();
	}

	componentWillReceiveProps(next_props) {
		if (next_props.state.dialog.mode === this.props.state.dialog.mode) {
			return;
		}

		switch (next_props.state.dialog.mode) {
		case dialogModes.EDIT_DROPLET:
			this.setState({
				dialogType: DialogEditDroplet
			});
			break;

		default:
			this.setState({
				dialogType: Empty
			});
		}
	}

	render() {
		var classes = [this.props.settings.classes.dialog.main];

		if (this.props.state.dialog.mode !== dialogModes.NONE) {
			classes.push(this.props.settings.classes.dialog.visible);
		}

		var DialogByType = this.state && this.state.dialogType || Empty;

		return (
			<div className={classes.join(' ')}>
				<DialogByType
					class_ui={this.props.class_ui}
					class_template={this.props.class_template}
					state={this.props.state.dialog.state}/>
			</div>
		);
	}
}

Dialog.propTypes = Object.assign(CommonPropTypes, {
	onDialogComplete: PropTypes.func
});

Dialog.defaultProps = {};

export default Dialog;
import React, { Component, PropTypes } from 'react';

import CommonPropTypes from '../assets/common-prop-types.js';
import { dialogModes } from '../assets/constants.js';

import DialogEditDroplet from './dialogs/EditDroplet.jsx';

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
		console.log('componentWillReceiveProps', next_props);
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

	onSubmit() {
		if (typeof this.props.onDialogComplete === 'function') {
			this.props.onDialogComplete();
		}
	}

	render() {
		var classes = [this.props.settings.classes.dialog.main];
		console.log('this.props.state.dialog', this.props.state.dialog);
		if (this.props.state.dialog.mode !== dialogModes.NONE) {
			classes.push(this.props.settings.classes.dialog.visible);
		}
		console.log('Dialog#render', this.state);
		var DialogByType = this.state && this.state.dialogType || Empty;
		return (
			<div className={classes.join(' ')}>
				<form onSubmit={this.onSubmit}>
					<DialogByType/>
					<fieldset className="buttons">
						<button type="submit">Save</button>
					</fieldset>
				</form>
			</div>
		);
	}
}

Dialog.propTypes = Object.assign(CommonPropTypes, {
	onDialogComplete: PropTypes.func
});

Dialog.defaultProps = {};

export default Dialog;
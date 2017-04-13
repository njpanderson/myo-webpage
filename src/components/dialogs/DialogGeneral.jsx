import React, { Component } from 'react';

import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

import { dialog } from '../../assets/common-prop-types';

class DialogGeneral extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var buttons = this.props.data.buttons,
			classes = [
				this.props.settings.classes.dialog.container,
				this.props.settings.classes.popup
			];

		if (!buttons || !buttons.length) {
			buttons = [{
				type: 'submit',
				label: 'OK'
			}];
		}

		return (
			<div className={classes.join(' ')}
				ref={this.props.refCollector}>
				<DialogHeading
					title={this.props.data.title}
					notes={this.props.data.message}
					className={this.props.settings.classes.dialog.heading}/>

				<Form
					buttons={buttons}
					onButtonClick={this.props.onButtonClick}
					onSubmit={this.props.onDialogComplete}
					onCancel={this.props.onDialogCancel}/>
				<span className="arrow"/>
			</div>
		);
	}
}

DialogGeneral.propTypes = dialog;

export default DialogGeneral;
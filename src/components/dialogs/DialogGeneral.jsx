import React from 'react';

import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

import { dialog } from '../../assets/common-prop-types';

class DialogGeneral extends React.Component {
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
					settings={this.props.settings}
					buttons={buttons}
					onSubmit={this.props.onDialogComplete}
					onCancel={this.props.onDialogCancel}/>
				<span className="arrow"/>
			</div>
		);
	}
}

DialogGeneral.propTypes = dialog;

export default DialogGeneral;
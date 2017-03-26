import React, { Component, PropTypes } from 'react';

import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

class DialogGeneral extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var buttons = [],
			classes = [this.props.settings.classes.dialog.container];

		buttons.push({
			type: 'submit',
			label: 'OK'
		});

		return (
			<div className={classes.join(' ')}>
				<DialogHeading
					title={this.props.data.title}
					notes={this.props.data.message}
					className={this.props.settings.classes.dialog.heading}/>

				<Form
					buttons={buttons}
					onSubmit={this.props.onDialogComplete}
					onCancel={this.props.onDialogCancel}/>
			</div>
		);
	}
}

DialogGeneral.propTypes = {
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	onDialogCancel: PropTypes.func,
	onDialogComplete: PropTypes.func,
	class_ui: PropTypes.object.isRequired
};

DialogGeneral.defaultProps = {
	onDialogCancel: null,
	onDialogComplete: null,
};

export default DialogGeneral;
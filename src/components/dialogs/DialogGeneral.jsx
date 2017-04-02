import React, { Component, PropTypes } from 'react';

import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

class DialogGeneral extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var buttons = this.props.data.buttons,
			classes = [this.props.settings.classes.dialog.container];

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

DialogGeneral.propTypes = {
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	refCollector: PropTypes.func,
	onDialogCancel: PropTypes.func,
	onDialogComplete: PropTypes.func,
	onButtonClick: PropTypes.func,
	class_ui: PropTypes.object.isRequired
};

DialogGeneral.defaultProps = {
	onDialogCancel: null,
	onDialogComplete: null
};

export default DialogGeneral;
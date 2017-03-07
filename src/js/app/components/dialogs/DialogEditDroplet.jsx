import React, { Component, PropTypes } from 'react';
import CommonPropTypes from '../../assets/common-prop-types.js';

import Form from '../Form.jsx';

class DialogEditDroplet extends Component {
	constructor(props) {
		super(props);

		this.onDialogComplete = this.onDialogComplete.bind(this);
		this.onDialogCancel = this.onDialogCancel.bind(this);
	}

	onDialogComplete(values) {
		console.log('dialog complete', values);
	}

	onDialogCancel() {
		console.log('dialog cancelled');
		if (typeof this.props.onDialogCancel === 'function') {
			this.props.onDialogCancel();
		}
	}

	render() {
		var droplet = this.props.class_ui.getDropletById(this.props.state.droplet_id);
		console.log('editdroplet', droplet);

		return (
			<Form
				fields={droplet.editable}
				onSubmit={this.onDialogComplete}
				onCancel={this.onDialogCancel}/>
		);
	}
}

DialogEditDroplet.propTypes = Object.assign({}, CommonPropTypes, {
	// state: PropTypes.object
	onDialogCancel: PropTypes.func
});

DialogEditDroplet.defaultProps = {
	onDialogCancel: null
};

export default DialogEditDroplet;
import React, { Component } from 'react';
import CommonPropTypes from '../../assets/common-prop-types.js';

import Form from '../Form.jsx';

class DialogEditDroplet extends Component {
	constructor(props) {
		super(props);
	}

	onDialogComplete(values) {
		console.log('dialog complete', values);
	}

	onDialogCancel() {
		console.log('dialog cancelled');
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
});

DialogEditDroplet.defaultProps = {};

export default DialogEditDroplet;
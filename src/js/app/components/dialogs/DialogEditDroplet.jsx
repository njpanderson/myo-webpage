import React, { Component, PropTypes } from 'react';
import CommonPropTypes from '../../assets/common-prop-types.js';
import { setLabels } from '../../assets/constants.js';

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
		var droplet = this.props.class_ui.getDropletById(this.props.state.droplet_id),
			fieldsets = [], set;

		for (set in droplet.editable) {
			fieldsets.push({
				key: set,
				legend: setLabels[set],
				fields: {}
			});

			if (set === 'attrs') {
				fieldsets[fieldsets.length - 1].fields = droplet.editable[set];
			} else {
				fieldsets[fieldsets.length - 1].fields[set] = droplet.editable[set];
			}
		};

		return (
			<Form
				fieldSets={fieldsets}
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
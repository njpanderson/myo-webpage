import React, { Component, PropTypes } from 'react';

import FormField from '../../lib/FormField';
import { components } from '../../assets/common-prop-types';
import { setLabels } from '../../assets/constants';

import Form from '../views/Form.jsx';

class DialogEditDroplet extends Component {
	constructor(props) {
		super(props);

		this.onDialogComplete = this.onDialogComplete.bind(this);
		this.onDialogCancel = this.onDialogCancel.bind(this);
	}

	onDialogComplete(values) {
		if (typeof this.props.onDialogComplete === 'function') {
			this.props.onDialogComplete(values);
		}
	}

	onDialogCancel() {
		if (typeof this.props.onDialogCancel === 'function') {
			this.props.onDialogCancel();
		}
	}

	render() {
		var droplet = this.props.class_ui.getDropletById(this.props.state.droplet_id),
			fieldsets = [], set, attr;

		for (set in droplet.editable) {
			fieldsets.push({
				key: set,
				legend: setLabels[set],
				fields: []
			});

			if (set === 'attrs') {
				for (attr in droplet.editable[set]) {
					fieldsets[fieldsets.length - 1].fields.push(new FormField(
						attr,
						droplet.editable[set][attr].type,
						droplet.editable[set][attr]
					));
				}
			} else {
				fieldsets[fieldsets.length - 1].fields.push(new FormField(
					set,
					droplet.editable[set].type,
					droplet.editable[set]
				));
			}
		}

		return (
			<Form
				fieldSets={fieldsets}
				onSubmit={this.onDialogComplete}
				onCancel={this.onDialogCancel}/>
		);
	}
}

DialogEditDroplet.propTypes = Object.assign({}, components, {
	onDialogCancel: PropTypes.func,
	onDialogComplete: PropTypes.func
});

DialogEditDroplet.defaultProps = {
	onDialogCancel: null,
	onDialogComplete: null,
};

export default DialogEditDroplet;
import React, { Component, PropTypes } from 'react';

import FormField from '../../lib/FormField';
import { setLabels } from '../../assets/constants';

import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

class DialogEditDroplet extends Component {
	constructor(props) {
		super(props);

		this.onDialogComplete = this.onDialogComplete.bind(this);
		this.deleteDroplet = this.deleteDroplet.bind(this);
	}

	onDialogComplete(values) {
		var key,
			data = {};

		if (typeof this.props.onDialogComplete === 'function') {
			// massage data back into format replicating Droplet.data format
			for (key in values) {
				if (values.hasOwnProperty(key)) {
					if (key === 'attrs') {
						data[key] = values[key];
					} else {
						data[key] = values[key][key];
					}
				}
			}

			// send data to callback
			this.props.onDialogComplete(data);
		}
	}

	deleteDroplet() {
		console.log('delete droplet');
	}

	getFieldsets() {
		var droplet = this.props.class_ui.getDropletById(this.props.state.droplet_id),
			fieldsets = [],
			attachment = null,
			fieldset, field, attribute, item;

		if (this.props.state.attachment_index !== null) {
			attachment = this.props.class_ui.zoneGetAttachment(
				this.props.state.zone_id,
				this.props.state.attachment_index
			);
		}

		for (attribute in droplet.editable) {
			fieldset = {
				key: attribute,
				legend: setLabels[attribute],
				fields: []
			};

			// add indidual fields, depending on editable attribute type
			if (attribute === 'attrs') {
				// the 'attrs' attribute, which contains key/value pairs
				for (item in droplet.editable[attribute]) {
					field = Object.deepAssign({}, droplet.editable[attribute][item]);

					// preset value from attachment
					if (attachment !== null &&
						attachment.data.attrs &&
						attachment.data.attrs[item]) {
						field.value = attachment.data.attrs[item];
					}

					fieldset.fields.push(new FormField(
						item,
						droplet.editable[attribute][item].type,
						field
					));
				}
			} else {
				// string based attributes
				field = Object.deepAssign({}, droplet.editable[attribute]);

				// preset value from attachment
				if (attachment !== null && attachment.data[attribute]) {
					field.value = attachment.data[attribute];
				}

				fieldset.fields.push(new FormField(
					attribute,
					droplet.editable[attribute].type,
					field
				));
			}

			// add fieldset to form
			fieldsets.push(fieldset);
		}

		return fieldsets;
	}

	render() {
		var title, notes, buttons;

		buttons = [{
			type: 'cancel',
			onClick: this.props.onDialogCancel,
			label: 'Cancel'
		}];

		if (this.props.state.attachment_index !== null) {
			// editing
			title = 'Edit Droplet';
			notes = [
				'You can edit the Droplet using the fields below. ' +
					'Change the bits you want to customise and click “Add Droplet” when you’re done.'
			];
			buttons = buttons.concat({
				type: 'submit',
				label: 'Edit Droplet'
			}, {
				type: 'general',
				label: 'Delete Droplet',
				className: 'danger pull-left',
				onClick: this.deleteDroplet
			});
		} else {
			// adding
			title = 'Add Droplet';
			notes = [
				'You’ve found the right drop place to put this Droplet! ' +
					'Edit anything you would like to change and then click “Edit Droplet”.'
			];
			buttons = buttons.concat({
				type: 'submit',
				label: 'Add Droplet'
			});
		}

		return (
			<div className={this.props.settings.classes.dialog.container}>
				<DialogHeading
					title={title}
					notes={notes}
					className={this.props.settings.classes.dialog.heading}/>

				<Form
					fieldSets={this.getFieldsets()}
					buttons={buttons}
					onSubmit={this.onDialogComplete}
					onCancel={this.props.onDialogCancel}/>
			</div>
		);
	}
}

DialogEditDroplet.propTypes = {
	state: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	onDialogCancel: PropTypes.func,
	onDialogComplete: PropTypes.func,
	class_ui: PropTypes.object.isRequired
};

DialogEditDroplet.defaultProps = {
	onDialogCancel: null,
	onDialogComplete: null,
};

export default DialogEditDroplet;
import React, { Component, PropTypes } from 'react';

import FormField from '../../lib/FormField';
import { setLabels } from '../../assets/constants';

import { GLYPHS } from '../views/Icon.jsx';
import DialogHeading from './DialogHeading.jsx';
import Form from '../views/Form.jsx';

const headingsByType = {
	'element': {
		text: 'Element',
		icon: GLYPHS.TAG
	},
	'text': {
		text: 'Text item',
		icon: GLYPHS.TEXT
	},
	'attribute': {
		text: 'Attribute',
		icon: GLYPHS.PUZZLE_PIECE
	}
};

class DialogEditDroplet extends Component {
	constructor(props) {
		super(props);

		if (this.props.data && this.props.data.droplet_id) {
			this.droplet = this.props.class_ui.getDropletById(this.props.data.droplet_id);
		}

		this.onDialogComplete = this.onDialogComplete.bind(this);
		this.detachAttachment = this.detachAttachment.bind(this);
	}

	/**
	 * Instead of passing completion straight to the prop, handles conversion of raw form
	 * data back into a format matching the original droplet data.
	 */
	onDialogComplete(values, action, action_data) {
		var droplet_values = {},
			key;

		if (typeof this.props.onDialogComplete === 'function') {
			// convert data back into format replicating Droplet.data format
			for (key in values) {
				if (values.hasOwnProperty(key)) {
					if (key === 'attrs') {
						droplet_values[key] = values[key];
					} else {
						droplet_values[key] = values[key][key];
					}
				}
			}

			droplet_values = Object.deepAssign({}, this.droplet.data, droplet_values);

			// finally, fire the original prop with the converted data
			this.props.onDialogComplete(droplet_values, action, action_data);
		}
	}

	detachAttachment() {
		if (this.props.data.attachment_index !== null) {
			this.props.class_ui.zoneDetachAttachment(
				this.props.data.zone_id,
				this.props.data.attachment_index
			);
		} else {
			throw new Error('attachment_index is null or not defined. Cannot detach');
		}

		this.props.onDialogCancel();
	}

	getFieldsets() {
		var fieldsets = [],
			attachment = null,
			fieldset, field, attribute, item;

		if (this.props.data.attachment_index !== null) {
			attachment = this.props.class_ui.zoneGetAttachment(
				this.props.data.zone_id,
				this.props.data.attachment_index
			);
		}

		for (attribute in this.droplet.editable) {
			fieldset = {
				key: attribute,
				legend: setLabels[attribute],
				fields: []
			};

			// add indidual fields, depending on editable attribute type
			if (attribute === 'attrs') {
				// the 'attrs' attribute, which contains key/value pairs
				for (item in this.droplet.editable[attribute]) {
					field = Object.deepAssign({}, this.droplet.editable[attribute][item]);

					// preset value from attachment
					if (attachment !== null &&
						attachment.data.attrs &&
						attachment.data.attrs[item]) {
						field.value = attachment.data.attrs[item];
					}

					fieldset.fields.push(new FormField(
						item,
						this.droplet.editable[attribute][item].type,
						field
					));
				}
			} else {
				// string based attributes
				field = Object.deepAssign({}, this.droplet.editable[attribute]);

				// preset value from attachment
				if (attachment !== null && attachment.data[attribute]) {
					field.value = attachment.data[attribute];
				}

				fieldset.fields.push(new FormField(
					attribute,
					this.droplet.editable[attribute].type,
					field
				));
			}

			// add fieldset to form
			fieldsets.push(fieldset);
		}

		return fieldsets;
	}

	render() {
		var fieldsets = this.getFieldsets(),
			buttons = [],
			classes = [this.props.settings.classes.dialog.container],
			title, notes;

		classes.push('droplet-' + this.droplet.dropletType);

		// add cancel button (for every dialog type)
		buttons.push({
			type: 'cancel',
			label: 'Cancel'
		});

		if (this.props.data.attachment_index !== null) {
			// editing an existing droplet
			title = 'Edit ' + headingsByType[this.droplet.dropletType].text;

			if (fieldsets.length) {
				notes = [
					'You can edit the Droplet using the fields below. ' +
						'Change the bits you want to customise and use “Add Droplet” when you’re done.'
				];

				buttons.push({
					type: 'submit',
					label: 'Edit Droplet'
				});
			} else {
				notes = [
					'There is nothing to edit on this Droplet, but you can remove it ' +
						'With the “Remove Droplet” button.'
				];
			}

			buttons.push({
				type: 'remove_droplet',
				label: 'Remove Droplet',
				className: 'danger pull-left',
				data: {
					attachment_index: this.props.data.attachment_index,
					zone_id: this.props.data.zone_id
				}
				// onClick: this.detachAttachment
			});
		} else {
			// adding
			title = 'Add ' + headingsByType[this.droplet.dropletType].text;
			notes = [
				'You’ve found the right drop place to put this Droplet! ',
				'Edit anything you would like to change and then use “Edit Droplet”.'
			];
			buttons = buttons.concat({
				type: 'submit',
				label: 'Add Droplet'
			});
		}

		return (
			<div className={classes.join(' ')}
				ref={this.props.refCollector}>
				<DialogHeading
					title={title}
					notes={notes}
					iconGlyph={headingsByType[this.droplet.dropletType].icon}
					className={this.props.settings.classes.dialog.heading}/>

				<Form
					fieldSets={fieldsets}
					buttons={buttons}
					onButtonClick={this.props.onButtonClick}
					onSubmit={this.onDialogComplete}
					onCancel={this.props.onDialogCancel}/>
				<span className="arrow"/>
			</div>
		);
	}
}

DialogEditDroplet.propTypes = {
	data: PropTypes.object.isRequired,
	settings: PropTypes.object.isRequired,
	refCollector: PropTypes.func,
	onDialogCancel: PropTypes.func,
	onDialogComplete: PropTypes.func,
	onButtonClick: PropTypes.func,
	class_ui: PropTypes.object.isRequired
};

DialogEditDroplet.defaultProps = {
	onDialogCancel: null,
	onDialogComplete: null,
};

export default DialogEditDroplet;
import React, { Component } from 'react';
import CommonPropTypes from '../../assets/common-prop-types.js';

class EditDroplet extends Component {
	render() {
		return (
			<div>
				<fieldset>
					[droplet editing stuff goes here]
				</fieldset>
			</div>
		);
	}
}

EditDroplet.propTypes = CommonPropTypes;

EditDroplet.defaultProps = {};

export default EditDroplet;
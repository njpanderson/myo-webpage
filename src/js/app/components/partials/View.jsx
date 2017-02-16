import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';
import CommonPropTypes from '../../assets/common-prop-types.js';

class View extends Component {
	constructor() {
		super();
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('view_frame');
		}
	}

	render() {
		return (
			<section className="view">
				<iframe ref={collectRef(this.props, 'view_frame')}
					src={this.props.view.src}></iframe>
			</section>
		);
	}
}

View.propTypes = Object.assign(CommonPropTypes, {
	view: PropTypes.object
});

export default View;
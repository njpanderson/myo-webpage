import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';

class View extends Component {
	constructor(props) {
		super(props);
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
					src={this.props.settings.view.src}></iframe>
			</section>
		);
	}
}

View.propTypes = {
	settings: PropTypes.object,
	onMount: PropTypes.func,
	refCollector: PropTypes.func,
};

export default View;
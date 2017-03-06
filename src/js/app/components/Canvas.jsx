import React, { Component, PropTypes } from 'react';
import { collectRef } from '../lib/utils';
import CommonPropTypes from '../assets/common-prop-types.js';

import View from './views/View.jsx';
import Pallet from './views/Pallet.jsx';
import Template from './views/Template.jsx';
import Dialog from './views/Dialog.jsx';

class Canvas extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('canvas');
		}
	}

	render() {
		var canvas_classes = [
			this.props.settings.classes.canvas,
			this.props.state.app.ui_state
		];

		if (this.props.state.app.active) {
			canvas_classes.push(this.props.settings.classes.canvas_active);
		}

		return (
			<div className={canvas_classes.join(' ')}
				ref={collectRef(this.props, 'canvas')}
				>
				<header>
					<h1>Tag</h1>
					<p>Short introductory text on how to use tag...</p>
				</header>

				<div className="main">
					<Template {...this.props}
						template={this.props.data.template}
						/>
					<View {...this.props}
						view={this.props.view}/>
				</div>

				<Pallet {...this.props}/>

				<div className="overlay"></div>
				<Dialog {...this.props}/>
			</div>
		);
	}
}

Canvas.propTypes = Object.assign(CommonPropTypes, {
	settings: PropTypes.object.isRequired,
	view: PropTypes.object
});

export default Canvas;
import React, { Component, PropTypes } from 'react';
import { collectRef } from '../lib/utils';
import CommonPropTypes from '../assets/common-prop-types.js';

import View from './partials/View.jsx';
import Pallet from './Pallet.jsx';
import Template from './Template.jsx';

class Canvas extends Component {
	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('canvas');
		}
	}

	render() {
		return (
			<div className="myo-canvas"
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
					<View html="<b>Some HTML</b>"/>
				</div>

				<Pallet
					{...this.props}/>
			</div>
		);
	}
}

Canvas.propTypes = CommonPropTypes;

export default Canvas;
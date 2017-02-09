import React, { Component } from 'react';
import View from './partials/View.jsx';

import Pallet from './Pallet.jsx';
import Template from './Template.jsx';

class Canvas extends Component {
	render() {
		return (
			<div className="myo-canvas">
				<header>
					<h1>Tag</h1>
					<p>Short introductory text on how to use tag...</p>
				</header>

				<div className="main">
					<Template template={this.props.template}/>
					<View html="<b>Some HTML</b>"/>
				</div>

				<Pallet
					pallet={this.props.pallet}
					onPalletDrop={this.props.onPalletDrop}/>
			</div>
		);
	}
}

module.exports = Canvas;
import React, { Component } from 'react';
import View from './partials/View.jsx';

import PalletContainer from './containers/PalletContainer';
import TemplateContainer from './containers/TemplateContainer';

class Canvas extends Component {
	render() {
		return (
			<div className="myo-canvas">
				<header>
					<h1>Tag</h1>
					<p>Short introductory text on how to use tag...</p>
				</header>

				<div className="main">
					<TemplateContainer/>
					<View html="<b>Some HTML</b>"/>
				</div>

				<PalletContainer/>
			</div>
		);
	}
}

module.exports = Canvas;
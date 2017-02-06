import React, { Component } from 'react';
import Template from './Template.jsx';
import View from './partials/View.jsx';

import PalletItems from './containers/PalletItems';

class Canvas extends Component {
	render() {
		return (
			<div className="myo-canvas">
				<header>
					<h1>Tag</h1>
					<p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
				</header>

				<div className="main">
					<Template/>
					<View html="<b>Some HTML</b>"/>
				</div>

				<PalletItems/>
			</div>
		);
	}
}

module.exports = Canvas;
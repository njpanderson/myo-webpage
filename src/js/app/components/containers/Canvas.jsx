import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';

import View from '../views/View.jsx';
import Pallet from '../views/Pallet.jsx';
import Template from './TemplateContainer';
import Dialog from './DialogContainer';

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

		return (
			<div className={canvas_classes.join(' ')}
				ref={collectRef(this.props, 'canvas')}
				>
				<header>
					<h1>Tag</h1>
					<p>Short introductory text on how to use tag...</p>
				</header>

				<div className="main">
					<Template
						data={this.props.data}
						settings={this.props.settings}
						refCollector={this.props.refCollector}
						onMount={this.props.onMount}
						template={this.props.data.template}
						class_ui={this.props.class_ui}
						/>
					<View
						settings={this.props.settings}
						onMount={this.props.onMount}
						refCollector={this.props.refCollector}/>
				</div>

				<Pallet
					data={this.props.data}
					settings={this.props.settings}
					onMount={this.props.onMount}
					refCollector={this.props.refCollector}/>

				<div className="overlay"></div>
				<Dialog
					data={this.props.data}
					settings={this.props.settings}
					class_ui={this.props.class_ui}
					class_template={this.props.class_template}
					onDialogComplete={this.props.onDialogComplete}
					onDialogCancel={this.props.onDialogCancel}/>
			</div>
		);
	}
}

Canvas.propTypes = {
	data: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
	onMount: PropTypes.func.isRequired,
	onDialogComplete: PropTypes.func.isRequired,
	onDialogCancel: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	settings: PropTypes.object.isRequired,
	class_ui: PropTypes.object.isRequired,
	class_template: PropTypes.object.isRequired,
};

export default Canvas;
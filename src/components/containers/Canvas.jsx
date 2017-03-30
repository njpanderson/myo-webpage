import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';

import View from '../views/View.jsx';
import Header from '../views/Header.jsx';
import Template from './TemplateContainer';
import Dialog from './DialogContainer';
import Pallet from './PalletContainer';

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
		var classes = [
			this.props.settings.classes.canvas,
			this.props.state.ui_state
		];

		if (this.props.active_droplet_id !== '') {
			classes.push(this.props.settings.classes.droplet_active);
		}

		return (
			<div className={classes.join(' ')}
				ref={collectRef(this.props, 'canvas')}
				>
				<Header
					settings={this.props.settings}
					class_app={this.props.class_app}>
					<h1>&lt;<b>Tag</b>&gt;</h1>
				</Header>

				<div className="main">
					<Template
						data={this.props.data}
						settings={this.props.settings}
						refCollector={this.props.refCollector}
						onMount={this.props.onMount}
						onAttachmentClick={this.props.onAttachmentClick}
						onDropZoneClick={this.props.onDropZoneClick}
						template={this.props.data.template}
						class_ui={this.props.class_ui}
						/>
					<div className="drag-handle"
						onMouseDown={this.props.onDragHandlePress}
						onMouseUp={this.props.onDragHandlePress}
						onTouchStart={this.props.onDragHandlePress}
						onTouchEnd={this.props.onDragHandlePress}
						ref={collectRef(this.props, 'drag_handle')}></div>
					<View
						settings={this.props.settings}
						onMount={this.props.onMount}
						refCollector={this.props.refCollector}/>
				</div>

				<Pallet
					data={this.props.data}
					settings={this.props.settings}
					onMount={this.props.onMount}
					onDropletClick={this.props.onDropletClick}
					refCollector={this.props.refCollector}/>

				<div className="overlay"></div>
				<Dialog
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
	// from CanvasContainer
	state: PropTypes.object.isRequired,
	active_droplet_id: PropTypes.any,

	// from UI#render
	data: PropTypes.object.isRequired,
	onMount: PropTypes.func.isRequired,
	onDialogComplete: PropTypes.func.isRequired,
	onDialogCancel: PropTypes.func.isRequired,
	onAttachmentClick: PropTypes.func.isRequired,
	onDropletClick: PropTypes.func.isRequired,
	onDropZoneClick: PropTypes.func.isRequired,
	onDragHandlePress: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	settings: PropTypes.object.isRequired,
	class_ui: PropTypes.object.isRequired,
	class_app: PropTypes.object.isRequired,
	class_template: PropTypes.object.isRequired
};

export default Canvas;
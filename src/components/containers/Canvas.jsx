import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';

import View from '../views/View.jsx';
import Tooltip from '../views/Tooltip.jsx';
import Header from './HeaderContainer';
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

		if (typeof this.props.active_droplet_id === 'string' &&
			this.props.active_droplet_id !== '') {
			classes.push(this.props.settings.classes.droplet_active);
		}

		return (
			<div className={classes.join(' ')}
				ref={collectRef(this.props, 'canvas')}
				>
				<Header
					settings={this.props.settings}
					onButtonClick={this.props.onButtonClick}
					lib={this.props.lib}>
					<h1 className="logo">&lt;<b>Tag</b>&gt;</h1>
				</Header>

				<div className="main">
					<Template
						data={this.props.data}
						settings={this.props.settings}
						refCollector={this.props.refCollector}
						onMount={this.props.onMount}
						onAttachmentClick={this.props.onAttachmentClick}
						onDropZoneEvent={this.props.onDropZoneEvent}
						template={this.props.data.template}
						lib={this.props.lib}
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
					lib={this.props.lib}
					onMount={this.props.onMount}
					onDropletEvent={this.props.onDropletEvent}
					refCollector={this.props.refCollector}/>

				<div className="overlay"></div>
				<Dialog
					settings={this.props.settings}
					lib={this.props.lib}
					onButtonClick={this.props.onButtonClick}/>
				<Tooltip
					settings={this.props.settings}
					attacher={this.props.lib.setUIPopperAttachment}
					state={this.props.state_tooltip}/>
			</div>
		);
	}
}

Canvas.propTypes = {
	// from CanvasContainer
	state: PropTypes.object.isRequired,
	active_droplet_id: PropTypes.any,
	state_tooltip: PropTypes.object,

	// from UI#render
	data: PropTypes.object.isRequired,
	onMount: PropTypes.func.isRequired,
	onAttachmentClick: PropTypes.func.isRequired,
	onDropletEvent: PropTypes.func.isRequired,
	onDropZoneEvent: PropTypes.func.isRequired,
	onDragHandlePress: PropTypes.func.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	refCollector: PropTypes.func.isRequired,
	settings: PropTypes.object.isRequired,
	lib: PropTypes.object.isRequired
};

export default Canvas;
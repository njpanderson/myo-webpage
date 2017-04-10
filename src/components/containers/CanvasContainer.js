import { connect } from 'react-redux';

import Canvas from './Canvas.jsx';

const mapStateToProps = (state) => {
	return {
		state: state.app,
		active_droplet_id: state.UI.active_droplet_id,
		state_tooltip: state.UI.tooltip
	};
};

const CanvasContainer = connect(
  mapStateToProps
)(Canvas);

export default CanvasContainer;
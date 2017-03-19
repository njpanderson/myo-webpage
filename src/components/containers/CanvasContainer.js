import { connect } from 'react-redux';

import Canvas from './Canvas.jsx';

const mapStateToProps = (state) => {
	return {
		state: state.app
	};
};

const CanvasContainer = connect(
  mapStateToProps
)(Canvas);

export default CanvasContainer;
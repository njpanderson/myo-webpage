import { connect } from 'react-redux';

import Canvas from './Canvas.jsx';
import actions from '../../state/actions.js';

const mapStateToProps = (state) => {
	return {
		state: state.app
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onPalletDrop: (id) => {
			dispatch(actions.palletSetAttached(id, true));
		},
	};
};

const CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);

export default CanvasContainer;
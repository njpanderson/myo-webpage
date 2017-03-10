import { connect } from 'react-redux';

import Canvas from './Canvas.jsx';
import { dialogModes } from '../../assets/constants.js';
import actions from '../../state/actions.js';

const mapStateToProps = (state) => {
	return {
		state: state
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
import { connect } from 'react-redux';
import Canvas from './Canvas.jsx';
import { palletSetAttached } from '../state/actions.js';

const mapStateToProps = (state) => {
	return {
		template: state.template,
		pallet: state.pallet
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onPalletDrop: (id) => {
			dispatch(palletSetAttached(id, true));
		}
	};
};

const CanvasContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);

export default CanvasContainer;
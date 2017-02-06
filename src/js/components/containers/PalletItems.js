import { connect } from 'react-redux';
import Pallet from '../Pallet.jsx';
import { palletSetAttached } from '../../state/actions.js';

const mapStateToProps = (state) => {
	return {
		pallet: state.pallet
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onValidDrop: (id) => {
			dispatch(palletSetAttached(id, true));
		}
	};
};

const PalletItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(Pallet);

export default PalletItems;
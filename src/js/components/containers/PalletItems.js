import { connect } from 'react-redux';
import Pallet from '../Pallet.jsx';

const mapStateToProps = (state, ownProps) => {
	return {
		pallet: state.pallet
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onClick: () => {
			//dispatch(setVisibilityFilter(ownProps.filter))
		}
	};
};

const PalletItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(Pallet);

export default PalletItems;
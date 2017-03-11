import { connect } from 'react-redux';

import Dialog from '../dialogs/Dialog.jsx';
import { dialogModes } from '../../assets/constants';
import actions from '../../state/actions';

const mapStateToProps = (state) => {
	return {
		mode: state.dialog.mode,
		state: state.dialog.state
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onDialogCancel: () => {
			dispatch(actions.setDialogMode(dialogModes.NONE));
		},
	};
};

const DialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dialog);

export default DialogContainer;
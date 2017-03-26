import { connect } from 'react-redux';

import Dialog from '../dialogs/Dialog.jsx';
import { dialogModes } from '../../assets/constants';
import actions from '../../state/actions';

const mapStateToProps = (state) => {
	return {
		mode: state.UI.dialog.mode,
		data: state.UI.dialog.data
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
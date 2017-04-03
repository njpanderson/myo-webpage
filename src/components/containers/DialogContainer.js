import { connect } from 'react-redux';

import Dialog from '../dialogs/Dialog.jsx';

const mapStateToProps = (state) => {
	return {
		id: state.UI.dialog.id,
		mode: state.UI.dialog.mode,
		data: state.UI.dialog.data,
		onDialogComplete: state.UI.dialog.onDialogComplete,
		onDialogCancel: state.UI.dialog.onDialogCancel
	};
};

const DialogContainer = connect(
  mapStateToProps
)(Dialog);

export default DialogContainer;
import { connect } from 'react-redux';

import Dialog from '../dialogs/Dialog.jsx';

const mapStateToProps = (state) => {
	return {
		mode: state.UI.dialog.mode,
		data: state.UI.dialog.data
	};
};

const DialogContainer = connect(
  mapStateToProps
)(Dialog);

export default DialogContainer;
import { connect } from 'react-redux';

import Header from '../views/Header.jsx';

const mapStateToProps = (state) => {
	return {
		tour_stage: state.UI.tour_stage,
		dialog_mode: state.UI.dialog.mode
	};
};

const HeaderContainer = connect(
  mapStateToProps
)(Header);

export default HeaderContainer;
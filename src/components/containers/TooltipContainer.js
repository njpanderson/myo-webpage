import { connect } from 'react-redux';

import Tooltip from '../views/Tooltip.jsx';

const mapStateToProps = (state) => {
	return {
		state: state.UI.tooltip
	};
};

const TooltipContainer = connect(
  mapStateToProps
)(Tooltip);

export default TooltipContainer;
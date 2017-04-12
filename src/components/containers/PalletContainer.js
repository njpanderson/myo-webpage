import { connect } from 'react-redux';

import actions from '../../state/actions';
import Pallet from '../views/Pallet.jsx';

const mapStateToProps = (state) => {
	return {
		activeDropletId: state.UI.active_droplet_id
	};
};

const mapDispatchToProps = (dispatch, props) => {
	return {
		onDropletEvent: (event, droplet, data) => {
			switch (event.type) {
			case 'mouseenter':
			case 'touchstart':
				dispatch(actions.setTooltipContent(data.title, data.content, data.iconGlyph));
				dispatch(actions.showTooltip(data.ref));
				break;

			case 'mouseleave':
			case 'touchend':
			case 'click':
				dispatch(actions.hideTooltip());
				break;
			}

			props.onDropletEvent(event, droplet, data);
		}
	};
};

const PalletContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Pallet);

export default PalletContainer;
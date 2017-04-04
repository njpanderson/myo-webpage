import { connect } from 'react-redux';

import Template from '../views/Template.jsx';

const mapStateToProps = (state) => {
	return {
		zones: state.zones,
		activeDropletID: state.UI.active_droplet_id
	};
};

const TemplateContainer = connect(
  mapStateToProps
)(Template);

export default TemplateContainer;
import { connect } from 'react-redux';

import Template from '../views/Template.jsx';

const mapStateToProps = (state) => {
	return {
		zones: state.zones
	};
};

const TemplateContainer = connect(
  mapStateToProps
)(Template);

export default TemplateContainer;
import { connect } from 'react-redux';

import Template from '../views/Template.jsx';
import { dialogModes } from '../../assets/constants';
import actions from '../../state/actions';

const mapStateToProps = (state) => {
	return {
		zones: state.zones
	};
};

const TemplateContainer = connect(
  mapStateToProps
)(Template);

export default TemplateContainer;
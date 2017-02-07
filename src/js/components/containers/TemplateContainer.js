import { connect } from 'react-redux';
import Template from '../Template.jsx';

const mapStateToProps = (state) => {
	return {
		html: state.template.html
	};
};

const TemplateContainer = connect(
	mapStateToProps
)(Template);

export default TemplateContainer;
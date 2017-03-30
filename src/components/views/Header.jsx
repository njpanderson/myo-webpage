import React, { Component, PropTypes } from 'react';

import Toolbar from './Toolbar.jsx';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<header>
				{this.props.children}
				<Toolbar
					buttons={this.props.settings.toolbar}
					class_app={this.props.class_app}/>
			</header>
		);
	}
}

Header.propTypes = {
	children: PropTypes.object,
	settings: PropTypes.object,
	class_app: PropTypes.object.isRequired
};

export default Header;
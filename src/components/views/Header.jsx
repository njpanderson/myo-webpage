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
					tour_stage={this.props.tour_stage}
					dialog_mode={this.props.dialog_mode}
					settings={this.props.settings}
					onButtonClick={this.props.onButtonClick}
					lib={this.props.lib}/>
			</header>
		);
	}
}

Header.propTypes = {
	// from HeaderContainer
	tour_stage: PropTypes.any,
	dialog_mode: PropTypes.string,

	// from Canvas
	children: PropTypes.node,
	settings: PropTypes.object.isRequired,
	onButtonClick: PropTypes.func,
	lib: PropTypes.object.isRequired
};

export default Header;
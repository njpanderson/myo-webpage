import React, { PropTypes } from 'react';

export const GLYPHS = {
	ACCOUNT_LOGIN: require('../../../../img/svg/account-login.svg'),
	ACCOUNT_LOGOUT: require('../../../../img/svg/account-logout.svg')
};

export function Icon(props) {
	return (
		<svg className="icon" width={props.width} height={props.height}>
			<use xlinkHref={props.glyph}/>
		</svg>
	);
}

Icon.defaultProps = {
	width: 16,
	height: 16
};

Icon.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	glyph: PropTypes.string,
};
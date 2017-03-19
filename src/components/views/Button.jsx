import React, { PropTypes } from 'react';

var Button = function(props) {
	var type = (props.type === 'submit') ? 'submit' : 'button',
		classes = [props.className],
		onClick = props.onClick;

	if (props.type === 'cancel') {
		classes.push('cancel');
		onClick = props.onCancel;
	} else if (props.type === 'submit') {
		classes.push('primary');
	}

	return (
		<button
			className={classes.join(' ')}
			onClick={onClick}
			type={type}>
			{props.label}
		</button>
	);
};

Button.propTypes = {
	type: PropTypes.oneOf(['submit', 'cancel', 'general']).isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func,
	onCancel: PropTypes.func
};

export default Button;
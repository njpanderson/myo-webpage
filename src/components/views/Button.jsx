import React, { PropTypes } from 'react';

var Button = function(props) {
	var type = (props.type === 'submit') ? 'submit' : 'button',
		classes = ['button', props.className],
		onClick = props.onClick;

	if (props.type === 'cancel') {
		classes.push('cancel');
	} else if (props.type === 'submit') {
		classes.push('primary');
	}

	return (
		<button
			className={classes.join(' ')}
			onClick={onClick}
			type={type}>
			<span>{props.label}</span>
		</button>
	);
};

Button.propTypes = {
	type: PropTypes.oneOf(['submit', 'cancel', 'general']).isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func
};

export default Button;
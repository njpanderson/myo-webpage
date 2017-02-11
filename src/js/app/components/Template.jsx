import React, { Component, PropTypes } from 'react';

class Template extends Component {
	rawMarkup(html) {
		return { __html: html };
	}

	render() {
		return (
			<section className="template">
				<pre>
					<code className="html"
						dangerouslySetInnerHTML={this.rawMarkup(this.props.template.html)}/>
				</pre>
			</section>
		);
	}
}

Template.propTypes = {
	template: PropTypes.object
};

Template.defaultProps = {
	template: {
		html: ''
	}
};

export default Template;
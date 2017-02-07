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
						dangerouslySetInnerHTML={this.rawMarkup(this.props.html)}/>
				</pre>
			</section>
		);
	}
}

Template.propTypes = {
	html: PropTypes.string
};

Template.defaultProps = {
	html: []
};

module.exports = Template;
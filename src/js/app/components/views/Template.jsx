import React, { Component, PropTypes } from 'react';
import { collectRef } from '../../lib/utils';
import { components } from '../../assets/common-prop-types.js';

class Template extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (typeof this.props.onMount === 'function') {
			this.props.onMount('template');
		}
	}

	rawMarkup(html) {
		return { __html: html };
	}

	render() {
		return (
			<section className="template"
				ref={collectRef(this.props, 'template')}>
				<pre>
					<code className="html"
						ref={collectRef(this.props, 'template_inner')}
						dangerouslySetInnerHTML={this.rawMarkup(this.props.template)}/>
				</pre>
			</section>
		);
	}
}

Template.propTypes = Object.assign({}, components, {
	template: PropTypes.string
});

Template.defaultProps = {
	template: ''
};

export default Template;
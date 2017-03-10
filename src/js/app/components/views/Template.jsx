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

	createSandbox(html) {
		var sandbox = document.createElement('div'),
			children = [], text_element;
		sandbox.innerHTML = html;

		console.group('createSandbox');
		console.log(sandbox);

		sandbox.childNodes.forEach((node) => {
			switch (node.nodeType) {
			case Node.TEXT_NODE:
				console.log('text', node.textContent);
				text_element = document.createElement('span');
				text_element.class = this.props.settings.classes.text_element;
				text_element.textContent = node.textContent;

				children.push(text_element);
				break;

			case Node.ELEMENT_NODE:
				console.log('element', node);
				children.push(node);
				break;
			}
		});

		console.groupEnd();
		return children;
	}

	render() {
		var children = this.createSandbox(this.props.template);

		return (
			<section className="template"
				ref={collectRef(this.props, 'template')}>
				<pre>
					<code className="html"
						ref={collectRef(this.props, 'template_inner')}>
						{children}
					</code>
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
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
			children = [];
		sandbox.innerHTML = html;

		console.group('createSandbox');
		console.log(sandbox);

		sandbox.childNodes.forEach((node, index) => {
			var component, key;

			switch (node.nodeType) {
			case Node.TEXT_NODE:
				console.log('text', node.textContent);
				key = 'fragment-' + index;

				children.push(
					<span
						key={key}
						className={this.props.settings.classes.component}>{node.textContent}</span>
				);
				break;

			case Node.ELEMENT_NODE:
				console.log('element', node);
				children.push(
					<span
						key={node.dataset.id}
						className={node.className}
						data-id={node.dataset.id}
						data-attachments={node.dataset.attachment}>
						<span className="target">...</span>
					</span>
				);
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
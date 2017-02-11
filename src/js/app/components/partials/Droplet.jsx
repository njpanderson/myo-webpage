import React, { Component, PropTypes } from 'react';
import interact from 'interact.js';
import { collectRef } from '../../lib/utils';

class Droplet extends Component {
	constructor() {
		super();

		this.myrefs = {};
	}

	dragDrop(element) {
		var x = 0, y = 0;

		interact(element)
			.draggable({
				restrict: {
					restriction: $(element).closest('.myo-canvas').get(0),
					elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
					endOnly: false
				}
			})
			.on('dragmove', (event) => {
				x += event.dx;
				y += event.dy;

				event.target.style.webkitTransform =
				event.target.style.transform =
					'translate(' + x + 'px, ' + y + 'px)';
			});
	}

	componentDidMount() {
		//this.dragDrop(this.myrefs.a);
	}

	render() {
		var classes = ['droplet'];

		if (this.props.attached) {
			classes.push('attached');
		}

		return (
			<a href="#"
				name={this.props.id}
				className={classes.join(' ')}
				ref={collectRef(this.props, ['droplet'], this.props.id)}
				onClick={() => { this.props.onValidDrop(this.props.id); }}>
				{this.props.name}
			</a>
		);
	}
}

Droplet.propTypes = {
	name: PropTypes.string,
	id: PropTypes.string,
	title: PropTypes.string,
	attached: PropTypes.bool,
	onValidDrop: PropTypes.func,
	refCollector: PropTypes.func
};

export default Droplet;
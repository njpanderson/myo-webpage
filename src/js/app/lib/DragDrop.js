import interact from 'interact.js';

var DragDrop = function(canvas, settings, callbacks = {}) {
	this._canvas = canvas;
	this.settings = settings;
	this._callbacks = callbacks;

	this.ui = {
		drag: [],
		drop: []
	};
};

DragDrop.prototype = {
	addDragable: function(element, settings = {}) {
		var dragable = new Dragable(element);

		settings = Object.assign({
			restrict: {
				restriction: this._canvas,
				elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
				endOnly: false
			}
		}, settings);

		dragable.setDragable(settings)
			.on('dragstart', () => {
				this._canvas.classList.add(this.settings.classes.is_dragging);
				element.classList.add(this.settings.classes.droplet_dragging);
			})
			.on('dragend', () => {
				this._canvas.classList.remove(this.settings.classes.is_dragging);
				element.classList.remove(this.settings.classes.droplet_dragging);

				if (typeof this._callbacks.dragEnd === 'function') {
					this._callbacks.dragEnd(element);
				}
			});

		this.ui.drag.push(this._createInstance(element, dragable));
	},

	addDropable: function(element, settings = {}) {
		var dropable = new Dropable(element);

		dropable.setDropable(settings)
			.on('dropactivate', (event) => {
				// add active dropzone feedback
				event.target.classList.add(this.settings.classes.dropzone_active);
			})
			.on('dragenter', (event) => {
				// feedback the possibility of a drop
				event.target.classList.add(this.settings.classes.dropzone_target);
				// event.relatedTarget.classList.add('can-drop');
				// event.relatedTarget.textContent = 'Dragged in';
			})
			.on('dragleave', (event) => {
				// remove the drop feedback style
				event.target.classList.remove(this.settings.classes.dropzone_target);
				// event.relatedTarget.classList.remove('can-drop');
				// event.relatedTarget.textContent = 'Dragged out';
			})
			.on('drop', (event) => {
				if (typeof this._callbacks.drop === 'function') {
					this._callbacks.drop(event.relatedTarget, event.target);
				}
			})
			.on('dropdeactivate', (event) => {
				// remove active dropzone feedback
				event.target.classList.remove(this.settings.classes.dropzone_active);
				event.target.classList.remove(this.settings.classes.dropzone_target);
			});

		this.ui.drop.push(this._createInstance(element, dropable));
	},

	resetDragPosition: function(element) {
		if ((element = this.getDragInstance(element))) {
			element.instance.resetPosition();
		}
	},

	getDragInstance: function(element) {
		return this.ui.drag.find((item) => {
			return item.element === element;
		});
	},

	_createInstance: function(element, instance) {
		return {
			element,
			instance
		};
	}
};

/*
 * Generically handles the dragging and dropping of individual DOM nodes.
 * Uses interact.js (http://interactjs.io)
 */
var Dragable = function(element) {
	this._element = element;

	this._x = 0;
	this._y = 0;
};

Dragable.prototype = {
	/**
	 * Set up a draggable item.
	 */
	setDragable: function(settings) {
		return interact(this._element)
			.draggable(settings)
			.on('dragmove', (event) => {
				this._x += event.dx;
				this._y += event.dy;

				this._element.style.webkitTransform =
				this._element.style.transform =
					'translate(' + this._x + 'px, ' + this._y + 'px)';
			});
	},

	resetPosition: function() {
		this._x = 0;
		this._y = 0;

		this._element.style.webkitTransform =
		this._element.style.transform =
			'translate(0, 0)';
	},
};


/*
 * Generically handles drop zones in the DOM.
 * Uses interact.js (http://interactjs.io)
 */
var Dropable = function(element) {
	this._element = element;
};

Dropable.prototype = {
	/**
	 * Set up a draggable item.
	 */
	setDropable: function(settings) {
		return interact(this._element)
			.dropzone(settings);
	}
};

export default DragDrop;
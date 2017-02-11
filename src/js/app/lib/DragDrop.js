import interact from 'interact.js';

/*
 * Generically handles the dragging and dropping of individual DOM nodes.
 * Uses interact.js (http://interactjs.io)
 */
var DragDrop = function(canvas, element, settings) {
	this.settings = settings;
	this._canvas = canvas;
	this._element = element;
	this._x = 0;
	this._y = 0;
	this._dragable = false;
};

DragDrop.prototype = {
	/**
	 * Set up a draggable item.
	 */
	setDragable: function() {
		if (!this._dragable) {
			interact(this._element)
				.draggable({
					restrict: {
						restriction: this._canvas,
						elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
						endOnly: false
					}
				})
				.on('dragstart', () => {
					console.log('dragstart', event.target);
					event.target.classList.add(this.settings.classes.droplet_dragging);
				})
				.on('dragmove', (event) => {
					this._x += event.dx;
					this._y += event.dy;

					event.target.style.webkitTransform =
					event.target.style.transform =
						'translate(' + this._x + 'px, ' + this._y + 'px)';
				})
				.on('dragend', () => {
					console.log('dragend', event.target);
					event.target.classList.remove(this.settings.classes.droplet_dragging);
				});

			this._dragable = true;
		}
	}
};


/*
 * Generically handles drop zones in the DOM.
 * Uses interact.js (http://interactjs.io)
 */
var DropZone = function(element, outer, settings) {
	this.settings = settings;
	this._element = element;
	this._outer = outer;
	this._dropable = false;
};

DropZone.prototype = {
	/**
	 * Set up a draggable item.
	 */
	setDropable: function() {
		if (!this._dragable) {
			interact(this._element)
				.dropzone({
					// only accept elements matching this CSS selector
					accept: this.settings.selectors.droplet,
					//overlap: 0.75,
					ondropactivate: (event) => {
						// add active dropzone feedback
						event.target.classList.add(this.settings.classes.dropzone_active);
					},
					ondragenter: (event) => {
						// feedback the possibility of a drop
						event.target.classList.add(this.settings.classes.dropzone_target);
						// event.relatedTarget.classList.add('can-drop');
						// event.relatedTarget.textContent = 'Dragged in';
					},
					ondragleave: (event) => {
						// remove the drop feedback style
						event.target.classList.remove(this.settings.classes.dropzone_target);
						// event.relatedTarget.classList.remove('can-drop');
						// event.relatedTarget.textContent = 'Dragged out';
					},
					ondrop: (event) => {
						console.log('dropped droplet', event.relatedTarget, 'onto node', event.target);
					},
					ondropdeactivate: (event) => {
						// remove active dropzone feedback
						event.target.classList.remove(this.settings.classes.dropzone_active);
						event.target.classList.remove(this.settings.classes.dropzone_target);
					}
				});

			this._dragable = true;
		}
	}
};

export { DragDrop, DropZone };
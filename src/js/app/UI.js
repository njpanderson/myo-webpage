import { DragDrop } from './lib/DragDrop.js';
import CanvasContainer from './components/CanvasContainer';

import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

var UI = function(settings, refs, data, store) {
	/**
	 * Settings as defined when instantiating. Inherits from {@link App.defaults}
	 */
	this.settings = settings;
	this._refs = refs;
	this._data = data;
	this._store = store;

	this._data.dragdrop = {};

	// other stuff
	this._dragDropBindingsQueue = [];
};

UI.prototype = {
	/**
	 * Sends render() call to the React canvas.
	 * @private
	 */
	render: function() {
		const state = this._store.getState();

		if (state.app.active) {
			this._canvas = render(
				<Provider store={this._store}>
					<CanvasContainer
						data={this._data}
						classes={this.settings.classes}
						refCollector={this._refCollector.bind(this)}
						onMount={this._mountEvent.bind(this)}/>
				</Provider>,
				this._refs.ui.app
			);
		}
	},

	/**
	 * Element reference collector. Collects DOM elements from React components.
	 * Bind an element reference using the ref attribute and collectRef from utils.js
	 * @private
	 */
	_refCollector: function(collection, element, key) {
		// console.log('_refCollector', 'collection:' + collection, 'element:', element, 'key:' + key);
		if (element !== null) {
			if (typeof key === 'string') {
				if (typeof this._refs.components[collection] === 'undefined') {
					this._refs.components[collection] = {};
				}

				this._refs.components[collection][key] = element;
			} else {
				this._refs.components[collection] = element;
			}
		}
	},

	/**
	 * Captures mount events from React components by collection/key identifiers.
	 * Identifiers are the same as the ones stored with App#_refCollector
	 * @private
	 */
	_mountEvent: function(collection, key) {
		// console.log('_mountEvent', collection, key);
		if (this._getReferencedElement(collection, key)) {
			// valid component mounted
			// console.log('mounted', this._refs.components[collection][key]);
			switch (collection) {
			case 'canvas':
				this._setDragDropBindings();
				break;

			case 'template':
				// this._setDropZones(ref);
				this._queueDragDropBinding('drop', collection, key);
				break;

			case 'droplet':
				this._queueDragDropBinding('drag', collection, key);
			}
		} else {
			throw new Error(
				'Component mount event called but ref was not collected. ' +
				'component: ' + collection + (key ? '/' + key : '')
			);
		}
	},

	_queueDragDropBinding: function(type, collection, key) {
		if (this._refs.components.canvas) {
			// canvas already exists - immediately bind
			// console.log('_queueDragDropBinding - binding now');
			this._setDragDropBindings([{ type, collection, key }]);
		} else {
			// push to queue
			// console.log('_queueDragDropBinding - queueing up');
			this._dragDropBindingsQueue.push({ type, collection, key });
		}
	},

	_setDragDropBindings: function(queue = this._dragDropBindingsQueue) {
		// bind dragDrop handlers to the elements in the queue
		this._data.dragdrop.droplets = new DragDrop(
			this._refs.components.canvas,
			this.settings, {
				drop: this._handleDropletDrop.bind(this),
				dragEnd: (element) => {
					this._data.dragdrop.droplets.resetDragPosition(element);
				}
			}
		);

		queue.forEach((item) => {
			var ref = this._getReferencedElement(item.collection, item.key),
				drop_zones;

			// console.log('binding item', this._data.pallet[item.key], ref);
			// create a DragDrop instance and assign to the pallet item data
			if (item.type === 'drag') {
				this._data.dragdrop.droplets.addDragable(ref);
			} else if (item.type === 'drop') {
				drop_zones = ref.querySelectorAll(this.settings.selectors.drop_zone);

				drop_zones.forEach((zone) => {
					this._data.dragdrop.droplets.addDropable(zone, {
						accept: this.settings.selectors.droplet
					});
				});
			}
		});
	},

	_handleDropletDrop: function(element, zone) {
		console.log('drop success!', element, zone);
	},

	_getReferencedElement: function(collection, key) {
		var ref;

		if (
			(typeof key === 'undefined' && (ref = this._refs.components[collection])) ||
			(ref = this._refs.components[collection][key])
		) {
			return ref;
		}

		return false;
	}
};

export default UI;
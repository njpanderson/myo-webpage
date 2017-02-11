import { DragDrop, DropZone } from './lib/DragDrop.js';
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
		var ref;
		// console.log('_mountEvent', collection, key);
		if ((ref = this._getReferencedElement(collection, key))) {
			// valid component mounted
			// console.log('mounted', this._refs.components[collection][key]);
			switch (collection) {
			case 'canvas':
				this._setDragDropBindings();
				break;

			case 'template':
				this._setDropZones(ref);
				break;

			case 'droplet':
				this._queueDragDropBinding(collection, key, function(dragdrop, queue_item) {
					this._data.pallet[queue_item.key].dragdrop = dragdrop;
					dragdrop.setDragable();
				});
			}
		} else {
			throw new Error(
				'Component mount event called but ref was not collected. ' +
				'component: ' + collection + (key ? '/' + key : '')
			);
		}
	},

	_setDropZones: function(ref) {
		var drop_zones = ref.querySelectorAll(this.settings.selectors.drop_zone);
		console.log('_setDropZones', drop_zones);
		drop_zones.forEach((zone) => {
			var dropzone;
			console.log(zone);
			dropzone = new DropZone(zone, ref, this.settings);
			dropzone.setDropable();
		});
	},

	_queueDragDropBinding: function(collection, key, fn) {
		if (this._refs.components.canvas) {
			// canvas already exists - immediately bind
			// console.log('_queueDragDropBinding - binding now');
			this._setDragDropBindings([{ collection, key, fn }]);
		} else {
			// push to queue
			// console.log('_queueDragDropBinding - queueing up');
			this._dragDropBindingsQueue.push({ collection, key, fn });
		}
	},

	_setDragDropBindings: function(queue = this._dragDropBindingsQueue) {
		var dragdrop;

		// bind dragDrop handlers to the elements in the queue
		queue.forEach((item) => {
			var ref = this._getReferencedElement(item.collection, item.key);
			// console.log('binding item', this._data.pallet[item.key], ref);
			// create a DragDrop instance and assign to the pallet item data
			if (typeof item.fn === 'function') {
				dragdrop = new DragDrop(
					this._refs.components.canvas,
					ref,
					this.settings
				);

				item.fn.apply(this, [dragdrop, item]);
			}
		});
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
import Droplet from './Droplet';

var DropZone, drop_zone_id = 0;

/**
 * @class
 */
DropZone = function(data = {}, tag) {
	this.tag = tag;
	this.id = 'drop_zone_' + ++drop_zone_id;
	this.attachmentId = data.attachmentId;
	this.maxAttachments = (typeof data.maxAttachments !== 'undefined' ? data.maxAttachments : 1);
};

DropZone.prototype = {
	/**
	 * Test if the DropZone instance will accept a new droplet. The test looks at the
	 * maximum number of attachments and attachment eligibility based on attachmentId
	 */
	willAccept: function(droplet, store) {
		var current_attachments = 0,
			state;

		if (!(droplet instanceof Droplet)) {
			throw new Error('A valid Droplet instance must be passed to DropZone#willAccept.');
		}

		if (store) {
			// store exists - get state (and current number of attachments)
			state = store.getState();

			if (state.zones[this.id] && state.zones[this.id].attachments) {
				current_attachments = state.zones[this.id].attachments.length;
			}
		}

		// test attachment count
		if (this.maxAttachments !== 0 && current_attachments === this.maxAttachments) {
			return false;
		}

		// test attachmentId eligibility
		if (this.attachmentId !== '*' &&
			droplet.attachmentIds.indexOf(this.attachmentId) === -1) {
			return false;
		}

		return true;
	}
};

/**
 * Matches a drop zone within the supplied markup.
 * Can be used more than once on the same markup, and will internally increment through the data.
 */
DropZone.fetchZone = function(markup) {
	var match, zone;

	// keep looking for a valid drop zone - report on the bad ones
	while ((match = DropZone._re_zones.exec(markup)) !== null) {
		if (match !== null && (zone = DropZone.checkSyntax(match[0]))) {
			// return it
			return new DropZone({
				attachmentId: zone.attachmentId,
				maxAttachments: zone.maxAttachments
			}, match[0]);
		}
	}

	return null;
};

/**
 * Checks and reports on syntax errors within a supplied tag.
 */
DropZone.checkSyntax = function(tag) {
	var d;

	if ((d = tag.match(DropZone.syntax_re.re_structure)) !== null && d[1] !== null) {
		// check id portion
		if (!d[2] || !DropZone.syntax_re.re_id.test(d[2])) {
			return DropZone.snytaxFault(
				d[1],
				'Invalid syntax. ID must either start with a letter and only contain' +
				' letters, numbers, and the undescore (_) character, or be an asterisk (*) ' +
				'to specify any attachment ID.',
				d[2]
			);
		}

		// check quantity portion
		if (
			d[4] &&
			(
				!DropZone.syntax_re.re_qty.test(d[4]) ||
				(d[4] < 1 || d[4] > 100)
			)
		) {
			return DropZone.snytaxFault(
				d[1],
				'Invalid syntax. Quantity must be a valid number and between 1 and 100, ' +
					'or the asterisk (*) character to specify unlimited up to the internal maximum.',
				d[4]
			);
		}
	} else {
		return DropZone.snytaxFault(tag, 'Invalid syntax.');
	}

	return {
		attachmentId: d[2],
		maxAttachments: (d[4] === '*' ? 0 : (parseFloat(d[4]) || 1))
	};
};

DropZone.snytaxFault = function(str, message, char) {
	var error;

	if (char) {
		// escape % symbols
		str = str.replace('%', '%%');
		char = char.replace('%', '%%');

		// add colouring
		str = str.replace(char, '%c$&%c');

		error = 'Error with syntax in tag "' + str + '": ' + message;
		console.warn(error, 'color: red;', 'color: inherit;');
	} else {
		// basic error with no colouring
		error = 'Error with syntax in tag "' + str + '": ' + message;
		console.warn(error);
	}

	return false;
};

/**
 * Discriminating regex collection for testing drop zones with explicit syntax.
 */
DropZone.syntax_re = {
	re_structure: /^\{\{\s?(([^|\s]+)(\|([^|\s]*))?)\s?\}\}$/,
	re_id: /^[a-z*][a-z0-9_]*$/i,
	re_qty: /^[0-9*]+$/
};

/**
 * Inclusive regex for capturing individual zones with basic syntax
 */
DropZone._re_zones = /\{\{\s?(.+?)(\|(.*?))?\s?\}\}/gi;

export default DropZone;
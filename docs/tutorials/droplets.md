# Droplets

Droplets are individual components defined in a JSON format which, when dropped onto the template, form snippets of code. They are represented as buttons on the lower palette which can be dragged into drop zones on the template.

Droplets can be placed anywhere within your template, which is injected into the `view` container on the view page.

## Droplet types (dropletType)

The `dropletType` attribute is the second most important attribute after the key name. This defines how the droplet will be rendered on the view frame. The various droplet types are as follows:

Type         | Description
:---         | :---
`text`       | A plain text droplet. Will render as a text node. Usually inserted between or within the tags of elements.
`element`    | A whole HTMLElement node. Will render as an HTML tag.
`attribute`  | A single attribute. Usually placed within HTML element definitions.

The following droplet attributes are commonly used:

Attribute        | Required | Default | Description
:---             | :---     | :---    | :---
`name`           | Required | (empty) | The user-friendly name shown within the palette.
`dropletType`    | Required | (empty) | As above.
`attachmentIds`  | Required | []      | An array of drop zone IDs this droplet can be attached to.
`editable`       | Optional | {}      | An object of attributes which can be edited when attaching the droplet to the template. Only certain attributes are supported (listed below).
`guidance`       | Optional | (empty) | Guidance HTML, explaining how the droplet will work. Will be displayed within the Droplet tooltip.

## Droplet type specific attributes

### "text" type

Equivalent to a text node, the following attributes are available:

Attribute        | Required | Default | Description
:---             | :---     | :---    | :---
`value`          | Required | (empty) | The value of the text node within the template.

### "element" type

Equivalent to an HTMLElement node, the following attributes are available:

Attribute        | Required | Default | Description
:---             | :---     | :---    | :---
`attrs`          | Optional | {}      | Key/value pairs defining the HTML attributes which should be added to the placed element.
`tagName`        | Required | (empty) | The HTMLElement tag name to use for the placed element.
`innerHTML`      | Optional | (empty) | If the HTMLElement defined is a tag pair (e.g. `<a></a>`), this attribute defines the HTML content to place between the opening and closing tags.

### "attribute" type

Equivalent to a single HTMLElement attribute, the following attributes are available:

Attribute        | Required | Default | Description
:---             | :---     | :---    | :---
`key`            | Required | (empty) | The key (name) of the attribute.
`value`          | Required | (empty) | The value of the attribute.

## Editable attributes

When dropping a droplet into the drop zones, certain attributes can be edited through a dialog. The supported attributes for editing are:

 - `value`
 - `attrs`
 - `tagName`
 - `innerHTML`

These attributes are defined as editable by using the `editable` object, as a key/value pair of attribute names and their editable definition. The exception is `attrs`, which is instead an object containing the actual HTMLElement attributes themselves, and their editable definition.

For example, to define the attribute `value` is editable within a droplet of `dropletType` "text":

```
	[
		{
			"name": "Header",
			"dropletType": "text",
			"value": "My Heading",
			"attachmentIds": ["header-1"],
			"editable": {
				"value": {
					"type": "text",
					"required": true
				}
			}
		},
		...
	]
```

To define the `innerHTML` attribute and the Element attribute `class` is editable within a droplet of type `element`:

```
	[
		{
			"name": "Letter button",
			"dropletType": "element",
			"innerHTML": "",
			"tagName": "a",
			"attrs": {
				"href": "#",
				"class": "button-blue"
			},
			"attachmentIds": ["button"],
			"editable": {
				"innerHTML": {
					"type": "longtext"
				},
				"attrs": {
					"class": {
						"type": "dropdown",
						"required": true,
						"values": ["button-blue", "button-red"]
					}
				}
			}
		},
		...
	]
```

(And in the above case, only a certain list of values are accepted.)

### ‘Editable’ definitions

The possible settings for each definition are:

Setting        | Optional | Description
:---           | :---     | :---
`type`         | No       | One of 'text', 'longtext', 'dropdown', 'checkbox', or 'radio'.
`required`     | Yes      | Boolean defining that the attribute must contain a value, or a function which will be invoked with the form values and can either return a boolean `true` or a string containing an error message. (**See note below**).
`label`        | Yes      | Field label (will otherwise inherit from the attribute name).
`options`      | Yes      | In the case of `dropdown` or `radio` types, either an array of possible values or an object defining key/value pairs.
`placeholder`  | Yes      | In the case of a text value, this will show in place of empty values.
`value`        | Yes      | In the case of array/object options, this set the value as 'selected'. If the type is `checkbox`, a boolean `true` or `false` will define its checked state.

**Note:** When using a function definition for the `required` value, the palette cannot be defined with JSON and must be loaded directly as a JS object with the `App#load` method.
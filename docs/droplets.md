# Droplets

Droplets are individual components defined in a JSON format which, when dropped onto the template, form snippets of code. They are represented as buttons on the lower pallet which can be dragged into drop zones on the template.

Droplets can be placed anywhere within the body or head, but cannot affect the `<body>`, `<head>` or `<html>` tags themselves. The `DOCTYPE` is also read only, and declared within the template.

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
`name`           | Required | (empty) | The user-friendly name shown within the pallet.
`dropletType`    | Required | (empty) | As above.
`attachmentIds`  | Required | []      | An array of drop zone IDs this droplet can be attached to.
`editable`       | Optional | {}      | An object of attributes which can be edited when attaching the droplet to the template. Only certain attributes are supported (listed below).

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
					"required": true
				}
			}
		},
		...
	]
```

To define the attribute `class` is editable within a droplet of type "element":

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
				"attrs": {
					"class": {
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
`required`     | No       | Boolean defining that the attribute must contain a value.
`values`       | Yes      | An array of possible values. Will show a dropdown element instead of a free text field during editing.
`placeholder`  | Yes      | In the case of a text value, this will show in place of empty values.
`default`      | Yes      | A default value.

## Drop zones

Within a template, drop zones are defined using bracket syntax, similar to Twig (but really, the similarity ends there!). Drop zones define, by their name, applicable points upon which you can place Droplets. Drop zones can also define the maximum number of Droplets which can be placed on them. An example template with some drop zones on it is as follows:

```
<!DOCTYPE html>
<html>
	<head>
		<title>{{ title }}</title>
	</head>
	<body>

		<header>
			<h1>{{ h1 }}</h1>
		</header>

		<main>
			<section class="{{ section_class }}">
				<h2>{{ intro }}</p>
				<div class="buttons">
					{{ button|5 }}
				</div>
				{{ * }}
			</section>
		</main>
	</body>
	<script src="libs.js"></script>
	{{ script-main }}
</html>
```

In the above template, there are a total of 7 drop zones. Each of them except for `button` allows a single Droplet placement. The `button` drop zone in this case allows for up to five Droplets with `attachmentIds` containing `button` to be placed upon it.

In the case of the drop zone `{{ * }}`, any droplet type can be placed here, but only once. To allow any number of any droplet (up to 100), The tag `{{ *|* }}` could be used.

The full syntax for a drop zone is as follows:

> `{{ droplet_name` OR `* [| 1-100` OR `*] }}`

Drop zones can be placed anywhere within the template, but it is recommended to only use Droplets with a `dropletType` of `text` as attribute values (for example, `section_class`).
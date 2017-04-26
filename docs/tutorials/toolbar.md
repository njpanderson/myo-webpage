# The toolbar

The toolbar can be customised by editing the `toolbar` property of the instantiation settings object.

The `toolbar` property is an array of objects each defining a single button. The button can either trigger methods on the tag App class, or run totally custom functions. An example toolbar button is as follows:

```
{
	... other settings...
	toolbar: [{
			label: 'Tour',
			icon: tag.GLYPHS.COMPASS,
			method: 'startTour'
		}
		... other tools...
	]
};
```

When rendered, the above button would be labeled "Tour" with a compass icon. When it is pressed, the App method `startTour` would be invoked with no arguments.

If `method` is a function, it will be invoked with the `this` keyword bound to the tag instance.

The possible key/value pairs for each button is:

Key              | Required | Default | Description
:---             | :---     | :---    | :---
`label`          | Required |         | The label for the button.
`icon`           | Optional | (empty) | An icon to show next to the label.
`method`         | Required |         | A method or function to invoke.
`arguments`      | Optional | []      | An array of argument values to send the invoked method.
`className`      | Optional |         | A string defining the class to apply to the toolbar item.
`separator`      | Optional | `false` | If `true`, will place a separator graphic to the left of the toolbar item.

## Toolbar icons

The tag App class contains a static object which references the list of possible icons which can be used with toolbar buttons. When importing tag's main class (`import App from '../Index';`), The icons can be referenced (for example) with `App.GLYPHS.[glyphname]`. The available icons which are sourced from the Iconic library are:


Glyph name       | Icon
:---             | :---
`TEXT`           | ![Text](http://neilinscotland.net/tag/iconic-png/text-2x.png)
`PUZZLE_PIECE`   | ![Text](http://neilinscotland.net/tag/iconic-png/puzzle-piece-2x.png)
`TAG`            | ![Text](http://neilinscotland.net/tag/iconic-png/tag-2x.png)
`COMPASS`        | ![Text](http://neilinscotland.net/tag/iconic-png/compass-2x.png)
`LOOP_CIRCULAR`  | ![Text](http://neilinscotland.net/tag/iconic-png/loop-circular-2x.png)
`MEDIA_PLAY`     | ![Text](http://neilinscotland.net/tag/iconic-png/media-play-2x.png)

For reference, these icons can be found here: https://useiconic.com/open. The glyph names are UPPERCASE, underscore separated versions of the names found on the iconic reference page.

## Defining your own toolbar

[write description of how the current toolbar will be replaced if you use a custom one - give example of current toolbar (updated manually?)]
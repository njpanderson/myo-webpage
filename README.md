# tag
tag is a Single Page App intended to guide users through the basics of creating web pages using a simple visual interface.

Demo here:
http://neilinscotland.net/tag/

## Installing

### Via Node JS (Version 6+)

`npm install njp-tag --save-dev`

Or if you're a Yarn user:

`yarn add njp-tag`

Once the package is installed, you'll need to create two main entry JS files for your implementation. One will import the tag base export, and another will import the view class:

```
// tag.js
const App = require('njp-tag');

app = new App();

app.load(
	'templates/default.html',
	'templates/pallet.json'
).catch(function(error) {
	console.error(error);
});
```

```
// view.js
const View = require('njp-tag/view');

window.view = new View({
	container: document.querySelector('.view')
});
```

Once these two files have been created, you can then transpile them using your favourite tool. (Although I recommend Webpack). Once that's done, create two HTML files for the app and view which should source your app and view bootstraps respectively:

```
<!-- index.html -->
<!DOCTYPE html>
	<html>
	<head>
		<title>My Tag App</title>
		<meta charset="utf-8"/>
	</head>
	<body>
		<main class="app"></main>
		<script src="dist/js/main.min.js"></script>
	</body>
</html>
```

```
<!-- view.html -->
<!DOCTYPE html>
<html>
	<head>
		<title>Tag - View</title>
		<meta charset="utf-8"/>
		<link rel="stylesheet" href="dist/css/view.min.css" type="text/css"/>
	</head>
	<body>
		<div class="view"></div>
		<script src="dist/js/view.min.js"></script>
	</body>
</html>
```

### In browsers

I'd recommend the above method for the most efficient file sizes, but if you want to use Tag straight away within a browser then the two files can be downloaded here:

 - Tag: [neilinscotland.net/files/get/tag/master/index.iife.js](http://neilinscotland.net/files/get/tag/master/index.iife.js)
 - View: [neilinscotland.net/files/get/tag/master/view.iife.js](http://neilinscotland.net/files/get/tag/master/view.iife.js)

Attaching these using normal `<script>` tags will work, with one caveat: You must already have the React environment loaded within your app index (although it is not required within the view frame). For example:

```
// index.html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js"></script>
<script src="index.iife.js"></script>
<script src="your_tag_initialisation.js"></script>
```

```
// view.html
<script src="dist/js/lib/view.iife.js" id="view"></script>
<script src="your_view_initialisation.js" id="view"></script>
```

## How tag works

[coming soon]

## Recommended setup

Before you begin, take note that this is only recommended setup guidance in order to get you started with using tag. If you wish to set things up in a different way, the only things must be considered:

 - tag `require('njp-tag').default` must be instantiated from `App` on the main page of your app.
 - View `require('njp-tag/view').default` must be instantiated from `View` on view page of your app, which is referenced by the settings passed to the `App` constructor, and is set to `"view.html"` by default.

You can also import the app/view files with ES2015 imports:

```
import App from 'njp-tag';
import View from 'njp-tag/view';
```

An example for the bare minimum required for tag to work is as follows:

```
├── ./
├── index.html [1]
├── view.html [2]
│   ├── js/
│   │   ├── main.js [3]
│   │   ├── view.js [4]
│   ├── css/ [5]
│   ├── templates/
│   │   ├── default.html [6]
│   │   ├── palette.json [7]
```

[1] Main page for displaying tag's interface.
[2] View page for displaying tag's view frame.
[3] Your bootstrapping script for the main class.
[4] Vour bootstrapping script for the view frame class.
[5] Any css you wish to use for the view frame.
[6] The view template.
[7] Your Droplet palette, in JSON format.

With the exception of the `html` files and `palette.json`, these are compiled files, usually from somewhere like `src/` in your project's root.

The following is required at bare minimum within the `main.js` source file:

```
// require the App class
const App = require('njp-tag').default;

// instantiate
var app = new App();

app.load(
	// the view template, with drop zones
	'templates/default.html',
	// the palette, containing droplets
	'templates/palette.json'
).catch((error) => {
	// show errors caught during the promise process
	console.error(error);
});
```

The following is required within the `view.js` source file:

```
// require the View class
const View = require('njp-tag/src/View').default;

// instantiate view...
new View({
	// ... defining a container div
	container: document.querySelector('.view')
});
```

Everything else is pretty much optional. You don't *need* to define View frame CSS or any extra CSS on top of tag itself, but obviously you'll want to make things look a bit nicer so it's recommended.
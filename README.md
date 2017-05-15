[![Build Status](https://travis-ci.org/njpanderson/tag.svg?branch=master)](https://travis-ci.org/njpanderson/tag)

# tag
![tag main window](https://raw.githubusercontent.com/njpanderson/tag/master/docs/tag-main.png)

tag is a Single Page App intended to guide users through the basics of creating web pages using a simple visual interface.

You can see a demo here:
http://neilinscotland.net/tag/

And the source code for this demo is here:
https://github.com/njpanderson/tag-lightshow

## Installing

### Via NPM

`npm install njp-tag --save`

Or if you're a Yarn user:

`yarn add njp-tag`

Once the package is installed, you'll need to create two entry JS files for your implementation. One will import the tag base `App` class, and another will import the `View` class:

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

 - Tag: [neilinscotland.net/files/get/njp-tag/master/index.iife.js](http://neilinscotland.net/files/get/njp-tag/master/index.iife.js)
 - View: [neilinscotland.net/files/get/njp-tag/master/view.iife.js](http://neilinscotland.net/files/get/njp-tag/master/view.iife.js)

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

Check out the [Wiki](https://github.com/njpanderson/tag/wiki) to get more information on usage.
**Note: Do not use this module, it is currently pre-alpha and the README contents are a constant work in progress**

**WARNING: This project is currenty UNLICENSED and is pending an appropriate open source license. For now, please do not make copies or distribute this project, or use it in any public-facing projects.**

# Tag
Tag is a Single Page App created to guide users through the basics of creating web pages using a simple visual interface.

## Installing

[installation instructions for es5 index/view files]

## How Tag works

[explain the main app and View frames, Droplets, Drop Zones and how they work with View templates]

## Recommended setup

Before you begin, take note that this is only recommended setup guidance in order to get you started with using Tag. If you wish to set things up in a different way, the only things must be considered:

 - Tag `require('njp-tag').default` must be instantiated from `App` on the main page of your app.
 - View `require('njp-tag/view').default` must be instantiated from `View` on view page of your app, which is referenced by the settings passed to the `App` constructor, and is set to `"view.html"` by default.

You can also import the app/view files with ES2015 imports:

```
import App from 'njp-tag';
import View from 'njp-tag/view';
```

An example for the bare minimum required for Tag to work is as follows:

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
│   │   ├── pallet.json [7]
```

[1] Main page for displaying Tag's interface.
[2] View page for displaying Tag's view frame.
[3] Your bootstrapping script for the main class.
[4] Vour bootstrapping script for the view frame class.
[5] Any css you wish to use for the view frame.
[6] The view template.
[7] Your Droplet pallet, in JSON format.

With the exception of the `html` files and `pallet.json`, these are compiled files, usually from somewhere like `src/` in your project's root.

The following is required at bare minimum within the `main.js` source file:

```
// require the App class
const App = require('njp-tag').default;

// instantiate
var app = new App();

app.load(
	// the view template, with drop zones
	'templates/default.html',
	// the pallet, containing droplets
	'templates/pallet.json'
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

Everything else is pretty much optional. You don't *need* to define View frame CSS or any extra CSS on top of Tag itself, but obviously you'll want to make things look a bit nicer so it's recommended.
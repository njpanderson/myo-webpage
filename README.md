**Note: Do not use this module, it is currently pre-alpha and the README contents are a constant work in progress**

# Tag
Tag is a Single Page App created to guide users through the basics of creating web pages using a simple visual interface.

## Installing

You'll need at minimum babel 6 and webpack 2 in order to build tag. If you don't already have webpack:

```
npm install webpack babel-core babel-loader njp-tag --save-dev
```

If you do have webpack, and any other other modules above, feel free to leave them out.

## Setting up Webpack

You'll also need at least the following **equivalent** or **similar** module rules (https://webpack.js.org/configuration/module/#rule) in your root `webpage.config.js` in order to ensure the CSS, SVG Sprites and JSX are handled appropriately. (the loaders referenced below all come with Tag):

```
config = {
	module: {
		rules: [{
			// loader for jsx/react
			test: /\.jsx?$/,
			exclude: /node_modules\/(?!njp-tag)/, // exclude all but this module
			loader: 'babel-loader'
		}, {
			// loader for the icon set
			test: /\.svg$/,
			loader: 'svg-sprite-loader?' + JSON.stringify({
				name: 'icon-[1]',
				prefixize: true,
				regExp: './img/svg/(.*)\\.svg'
			})
		},{
			// loader for the required css
			test: /\.scss$/,
			loader: 'style-loader!css-loader!sass-loader'
		}]
	}
	// ...
};
```

You also may want to add this to a root `.babelrc` file in order for the JSX and ES6 which Tag uses extensively to be correctly transpiled. (Again, all of the presets and plugins come with Tag).

```
{
  "plugins": ["transform-object-rest-spread"],
  "presets": ["react", "latest"]
}
```

## How Tag works

[explain the main app and View frames, Droplets, Drop Zones and how they work with View templates]

## Recommended setup

Before you begin, take note that this is only recommended setup guidance in order to get you started with using Tag. If you wish to set things up in a different way, the only things must be considered:

 - Tag `require('njp-tag').default` must be instantiated from `App` on the main page of your app.
 - View `require('njp-tag/src/View').default` must be instantiated from `View` on view page of your app, which is referenced by the settings passed to the `App` constructor, and is set to `"view.html"` by default.

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
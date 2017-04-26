# Templates

Creating HTML templates for tag is relatively easy, so long as a few rules are followed.

## What’s included

Anything you could theoretically place within the `body` tags is allowed. That includes `script`, `iframe` etc, but means you cannot add the CSS link into the head. Of course, if you're using something like Webpack to compile multipl assets this may not be needed, but either way it’s not a problem.

A sample template would look like the following:

```
<header>
	<h1>{{ h1 }}</h1>
</header>

<main>
	<section {{ section_class }}>
		<div class="buttons">
			{{ button|20 }}
		</div>
	</section>
</main>

{{ script_main }}
```

There are multiple Drop Zones within this template, which allow users to drag Droplets onto them, creating a completed page.

## Creating a view

The view template, the location of which is defined by the App settings, is a simple HTML file which contains at bare minimum a container with the class of `view` and the script source for `tag-vew.min.js`. An example view page is as follows:

```
<!DOCTYPE html>
<html>
<head>
	<title>tag - View</title>
	<meta charset="utf-8"/>
	<link rel="stylesheet" href="includes/css/main.css" type="text/css"/>
</head>
<body>
	<div class="view"></div>
	<script src="dist/js/tag-view.min.js" id="view"></script>
</body>
</html>
```

The `tag-view-min.js` script will bootstrap in the `View` class which controls rendering of the resulting page. All of the template markup will be placed within the `.view` container.

## A note on JavaScript

When the view is updated, all JavaScript defined within your template will be reloaded. Any JavaScript you have defined or attached within the view file itself will remain untouched. Keep this in mind when defining optional JavaScrit snippets (like in the example above).
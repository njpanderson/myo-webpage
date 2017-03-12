## Drop zones

Within a template, drop zones are defined using bracket syntax, similar to Twig (but really, the similarity ends there!). Drop zones define, by their name, applicable points upon which you can place Droplets. Drop zones can also define the maximum number of Droplets which can be placed on them. An example template with some drop zones on it is as follows:

```
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

{{ script-main }}
```

In the above template, there are a total of 7 drop zones. Each of them except for `button` allows a single Droplet placement. The `button` drop zone in this case allows for up to five Droplets with `attachmentIds` containing `button` to be placed upon it.

In the case of the drop zone `{{ * }}`, any droplet type can be placed here, but only once. To allow any number of any droplet (up to 100), The tag `{{ *|* }}` could be used.

The full syntax for a drop zone is as follows:

> `{{ droplet_name` OR `* [| 1-100` OR `*] }}`

Drop zones can be placed anywhere within the template, but it is recommended to only use Droplets with a `dropletType` of `text` as attribute values (for example, `section_class`).